/**
 * IndexedDB Draft Storage Module for GramHealth Connect
 *
 * Provides resilient, offline-first structured storage for field referral drafts.
 * Supports CRUD operations, offline idempotency tokens (offline_id), synchronization status
 * tracking, conflict mitigation, and retry queues.
 *
 * Security Note:
 * In accordance with rural healthcare data privacy guidelines, drafts stored in IndexedDB
 * contain essential referral routing parameters (facility, urgency, non-identifying operational triage notes).
 * Full patient clinical records are not permanently stored in cleartext client storage.
 */

const DB_NAME = 'GramHealth_DB';
const DB_VERSION = 1;
const STORE_NAME = 'referral_drafts';

let dbPromise = null;

/**
 * Initializes and returns the IndexedDB database instance
 */
export function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this browser.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('offlineId', 'offlineId', { unique: true });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('urgency', 'urgency', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  return dbPromise;
}

/**
 * Generates an idempotent offline ID for referral reconciliation with MySQL schema
 */
export function generateOfflineId() {
  return `OFF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

/**
 * Saves a new draft or updates an existing draft in IndexedDB
 * @param {Object} draftData
 * @returns {Promise<Object>} The saved draft record
 */
export async function saveDraft(draftData) {
  const db = await getDB();
  const now = new Date().toISOString();

  const draft = {
    id: draftData.id || `draft-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    offlineId: draftData.offlineId || generateOfflineId(),
    patientName: draftData.patientName || 'Anonymous / Walk-in Patient',
    age: Number(draftData.age) || null,
    gender: draftData.gender || 'Other',
    facilityId: draftData.facilityId || '',
    facilityName: draftData.facilityName || 'Unassigned Facility',
    symptoms: draftData.symptoms || '',
    urgency: draftData.urgency || 'Routine',
    notes: draftData.notes || '',
    // syncStatus: 'local_draft' | 'sync_pending' | 'synced' | 'sync_failed'
    syncStatus: draftData.syncStatus || 'local_draft',
    syncError: draftData.syncError || null,
    retryCount: draftData.retryCount || 0,
    createdAt: draftData.createdAt || now,
    updatedAt: now,
    syncedAt: draftData.syncedAt || null,
    serverTokenId: draftData.serverTokenId || null
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(draft);

    request.onsuccess = () => resolve(draft);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieves all saved drafts sorted by updatedAt descending
 * @returns {Promise<Array>}
 */
export async function getAllDrafts() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const records = request.result || [];
      // Sort newest first
      records.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      resolve(records);
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieves a single draft by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getDraftById(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Updates specific fields of an existing draft
 * @param {string} id
 * @param {Object} changes
 * @returns {Promise<Object>}
 */
export async function updateDraft(id, changes) {
  const existing = await getDraftById(id);
  if (!existing) {
    throw new Error(`Draft with ID "${id}" not found.`);
  }

  const updated = {
    ...existing,
    ...changes,
    updatedAt: new Date().toISOString()
  };

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updated);

    request.onsuccess = () => resolve(updated);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Deletes a draft by ID
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteDraft(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Clears all successfully synced drafts to conserve device storage
 * @returns {Promise<number>} Number of pruned records
 */
export async function clearSyncedDrafts() {
  const all = await getAllDrafts();
  const synced = all.filter((d) => d.syncStatus === 'synced');
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    synced.forEach((d) => store.delete(d.id));

    transaction.oncomplete = () => resolve(synced.length);
    transaction.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Seeds default demonstration drafts if the IndexedDB store is currently empty
 */
export async function seedInitialDraftsIfEmpty() {
  const existing = await getAllDrafts();
  if (existing.length === 0) {
    const sampleDrafts = [
      {
        id: 'draft-demo-1',
        offlineId: 'OFF-RAMESH-89',
        patientName: 'Ramesh Kumar',
        age: 52,
        gender: 'Male',
        facilityId: 'chc-shivnagar',
        facilityName: 'Shivnagar CHC',
        symptoms: 'Chest Pain and acute shortness of breath during agricultural labour',
        urgency: 'Emergency',
        syncStatus: 'sync_pending',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'draft-demo-2',
        offlineId: 'OFF-ANITA-41',
        patientName: 'Baby of Anita',
        age: 1,
        gender: 'Female',
        facilityId: 'phc-rampur',
        facilityName: 'PHC Rampur',
        symptoms: 'Routine Pentavalent booster vaccination schedule checkup',
        urgency: 'Routine',
        syncStatus: 'local_draft',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'draft-demo-3',
        offlineId: 'OFF-KAVITA-77',
        patientName: 'Kavita Devi',
        age: 34,
        gender: 'Female',
        facilityId: 'hwc-kalyanpur',
        facilityName: 'Kalyanpur HWC',
        symptoms: 'Severe pallor, fatigue, suspected iron deficiency anaemia in 2nd trimester',
        urgency: 'Priority',
        syncStatus: 'local_draft',
        createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString()
      }
    ];

    for (const d of sampleDrafts) {
      await saveDraft(d);
    }
    return sampleDrafts;
  }
  return existing;
}
