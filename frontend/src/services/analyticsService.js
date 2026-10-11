/**
 * Analytics and Metrics Calculation Module for GramHealth Connect
 *
 * Provides reusable statistical aggregations and data transformations
 * across facilities, referrals, and triage urgencies adhering strictly to
 * the MySQL database schema (backend/db/schema.sql).
 */

import { analyticsAPI, facilitiesAPI, referralsAPI } from './api.js';
import { VERIFIED_FACILITIES } from './facilitiesData.js';

/**
 * Standard seed referrals based on the MySQL schema enums:
 * status: 'REQUESTED' | 'REFERRED' | 'VISIT_CONFIRMED' | 'FOLLOW_UP' | 'COMPLETED' | 'CANCELLED'
 * Used when backend analytics endpoints are not yet online.
 */
export const SEED_REFERRALS = [
  { id: 'ref-1', facilityId: 'phc-rampur', facilityName: 'PHC Rampur', status: 'COMPLETED', urgency: 'Routine', date: '2025-09-01' },
  { id: 'ref-2', facilityId: 'chc-shivnagar', facilityName: 'Shivnagar CHC', status: 'COMPLETED', urgency: 'Emergency', date: '2025-09-03' },
  { id: 'ref-3', facilityId: 'phc-rampur', facilityName: 'PHC Rampur', status: 'VISIT_CONFIRMED', urgency: 'Priority', date: '2025-09-08' },
  { id: 'ref-4', facilityId: 'district-moradabad', facilityName: 'Moradabad District Hospital', status: 'COMPLETED', urgency: 'Emergency', date: '2025-09-12' },
  { id: 'ref-5', facilityId: 'hwc-kalyanpur', facilityName: 'Kalyanpur HWC', status: 'FOLLOW_UP', urgency: 'Routine', date: '2025-09-15' },
  { id: 'ref-6', facilityId: 'chc-shivnagar', facilityName: 'Shivnagar CHC', status: 'REFERRED', urgency: 'Priority', date: '2025-09-18' },
  { id: 'ref-7', facilityId: 'district-moradabad', facilityName: 'Moradabad District Hospital', status: 'COMPLETED', urgency: 'Emergency', date: '2025-09-22' },
  { id: 'ref-8', facilityId: 'fac-pb-1', facilityName: 'Civil Hospital Amritsar', status: 'COMPLETED', urgency: 'Priority', date: '2025-09-25' },
  { id: 'ref-9', facilityId: 'fac-pb-5', facilityName: 'Guru Gobind Singh MC', status: 'COMPLETED', urgency: 'Emergency', date: '2025-09-28' },
  { id: 'ref-10', facilityId: 'fac-pb-10', facilityName: 'Christian Medical College', status: 'VISIT_CONFIRMED', urgency: 'Emergency', date: '2025-10-01' },
  { id: 'ref-11', facilityId: 'fac-pb-15', facilityName: 'Rajindra Hospital Patiala', status: 'REFERRED', urgency: 'Priority', date: '2025-10-02' },
  { id: 'ref-12', facilityId: 'phc-rampur', facilityName: 'PHC Rampur', status: 'REQUESTED', urgency: 'Routine', date: '2025-10-03' },
  { id: 'ref-13', facilityId: 'chc-shivnagar', facilityName: 'Shivnagar CHC', status: 'REQUESTED', urgency: 'Emergency', date: '2025-10-04' },
  { id: 'ref-14', facilityId: 'district-moradabad', facilityName: 'Moradabad District Hospital', status: 'VISIT_CONFIRMED', urgency: 'Priority', date: '2025-10-05' },
  { id: 'ref-15', facilityId: 'fac-pb-22', facilityName: 'CHC Ajnala', status: 'COMPLETED', urgency: 'Routine', date: '2025-10-06' },
  { id: 'ref-16', facilityId: 'hwc-kalyanpur', facilityName: 'Kalyanpur HWC', status: 'CANCELLED', urgency: 'Routine', date: '2025-10-07' }
];

/**
 * Calculates facility distribution statistics
 */
export function calculateFacilityMetrics(facilities = []) {
  const safeList = Array.isArray(facilities) ? facilities : [];
  const total = safeList.length;

  const byType = {
    'PHC': 0,
    'CHC': 0,
    'District Hospital': 0,
    'Medical College': 0
  };

  const byDistrict = {};

  safeList.forEach((f) => {
    const t = f.type || 'PHC';
    byType[t] = (byType[t] || 0) + 1;

    const d = f.district || 'Other';
    byDistrict[d] = (byDistrict[d] || 0) + 1;
  });

  return {
    total,
    byType,
    byDistrict
  };
}

/**
 * Calculates referral status, priority urgency, and operational completion metrics
 */
export function calculateReferralMetrics(referrals = [], filters = {}) {
  const safeList = Array.isArray(referrals) ? referrals : [];

  // Apply optional filters (date range, urgency, status)
  const filtered = safeList.filter((r) => {
    if (filters.status && filters.status !== 'all' && r.status !== filters.status) {
      return false;
    }
    if (filters.urgency && filters.urgency !== 'all' && r.urgency !== filters.urgency) {
      return false;
    }
    if (filters.startDate && r.date && r.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && r.date && r.date > filters.endDate) {
      return false;
    }
    return true;
  });

  const total = filtered.length;

  const byStatus = {
    'REQUESTED': 0,
    'REFERRED': 0,
    'VISIT_CONFIRMED': 0,
    'FOLLOW_UP': 0,
    'COMPLETED': 0,
    'CANCELLED': 0
  };

  const byUrgency = {
    'Routine': 0,
    'Priority': 0,
    'Emergency': 0
  };

  const byFacility = {};
  const timelineMap = {};

  filtered.forEach((r) => {
    // Status counts
    const s = r.status ? r.status.toUpperCase() : 'REQUESTED';
    if (byStatus[s] !== undefined) {
      byStatus[s]++;
    } else {
      byStatus['REQUESTED']++;
    }

    // Urgency counts
    const u = r.urgency || 'Routine';
    if (byUrgency[u] !== undefined) {
      byUrgency[u]++;
    } else {
      byUrgency['Routine']++;
    }

    // Facility level counts
    const facName = r.facilityName || 'Unassigned';
    byFacility[facName] = (byFacility[facName] || 0) + 1;

    // Timeline distribution
    const dt = r.date ? r.date.slice(0, 10) : 'Recent';
    timelineMap[dt] = (timelineMap[dt] || 0) + 1;
  });

  const completed = byStatus['COMPLETED'];
  const activePending = byStatus['REQUESTED'] + byStatus['REFERRED'] + byStatus['VISIT_CONFIRMED'] + byStatus['FOLLOW_UP'];
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Convert timeline to sorted array
  const timeline = Object.keys(timelineMap)
    .sort()
    .map((date) => ({ date, count: timelineMap[date] }));

  // Top facilities by referrals
  const topFacilities = Object.entries(byFacility)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total,
    completed,
    activePending,
    completionRate,
    byStatus,
    byUrgency,
    topFacilities,
    timeline
  };
}

/**
 * Loads analytics data from backend API with transparent fallback to verified dataset
 */
export async function getAnalyticsData() {
  try {
    // Attempt backend summary endpoint
    const response = await analyticsAPI.getSummary();
    if (response?.data && (response.data.facilities || response.data.referrals)) {
      return {
        isDemo: false,
        sourceLabel: 'Live MySQL Backend (Express API)',
        facilities: response.data.facilities || [],
        referrals: response.data.referrals || []
      };
    }
  } catch (err) {
    // Backend analytics API endpoint is pending Member 2's implementation
  }

  // Gracefully return verified dataset adhering to MySQL schema
  return {
    isDemo: true,
    sourceLabel: 'Demonstration & Field Seed Data (38 Facilities, 16 Referrals)',
    facilities: VERIFIED_FACILITIES,
    referrals: SEED_REFERRALS
  };
}
