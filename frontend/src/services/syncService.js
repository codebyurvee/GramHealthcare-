/**
 * Draft Synchronization Service for GramHealth Connect
 *
 * Coordinates safe, idempotent syncing between offline IndexedDB drafts
 * and the Express backend API.
 * Ensures zero data loss, handles server errors, and provides detailed retry tracking.
 */

import { getAllDrafts, updateDraft } from './draftStorage.js';
import { referralsAPI } from './api.js';

export async function syncSingleDraft(draft) {
  // Prevent duplicate syncing if already synced
  if (draft.syncStatus === 'synced') {
    return { success: true, draft, status: 'already_synced' };
  }

  try {
    const payload = {
      offline_id: draft.offlineId,
      patient_name: draft.patientName,
      age: draft.age,
      gender: draft.gender,
      facility_id: draft.facilityId,
      facility_name: draft.facilityName,
      symptoms: draft.symptoms,
      urgency: draft.urgency,
      created_at: draft.createdAt
    };

    // Try batch sync endpoint first, fallback to create
    let response;
    try {
      response = await referralsAPI.syncDrafts([payload]);
    } catch (batchErr) {
      // If batch endpoint is not yet configured on backend, try standard referral create
      response = await referralsAPI.create(payload);
    }

    const serverData = response?.data || {};
    const serverToken = serverData.token || serverData.id || `SRV-${draft.offlineId.slice(-4)}`;

    const updated = await updateDraft(draft.id, {
      syncStatus: 'synced',
      syncedAt: new Date().toISOString(),
      syncError: null,
      serverTokenId: serverToken
    });

    return { success: true, draft: updated };
  } catch (err) {
    const errorMsg =
      err.response?.data?.message ||
      err.message ||
      'Server unreachable or offline. Draft safely preserved locally.';

    const updated = await updateDraft(draft.id, {
      syncStatus: 'sync_failed',
      syncError: errorMsg,
      retryCount: (draft.retryCount || 0) + 1
    });

    return { success: false, draft: updated, error: errorMsg };
  }
}

/**
 * Syncs all eligible drafts (pending, local, or failed)
 * @returns {Promise<{ total: number, synced: number, failed: number, details: Array }>}
 */
export async function syncAllDrafts() {
  if (!navigator.onLine) {
    throw new Error('Device is currently offline. Please reconnect to cellular or Wi-Fi network.');
  }

  const allDrafts = await getAllDrafts();
  const eligibleDrafts = allDrafts.filter(
    (d) => d.syncStatus === 'sync_pending' || d.syncStatus === 'local_draft' || d.syncStatus === 'sync_failed'
  );

  const results = {
    total: eligibleDrafts.length,
    synced: 0,
    failed: 0,
    details: []
  };

  for (const draft of eligibleDrafts) {
    const res = await syncSingleDraft(draft);
    if (res.success) {
      results.synced++;
    } else {
      results.failed++;
    }
    results.details.push(res);
  }

  return results;
}
