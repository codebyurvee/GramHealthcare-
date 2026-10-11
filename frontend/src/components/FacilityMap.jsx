import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './FacilityMap.css';

/**
 * FacilityMap — Interactive Leaflet Map for GramHealth Connect
 *
 * Displays healthcare facilities with valid lat/long coordinates,
 * category-coded marker pins, interactive popups, fit-bounds controls,
 * and seamless two-way synchronization with the facility list.
 */
export default function FacilityMap({
  facilities = [],
  selectedFacility = null,
  onSelectFacility,
  isLoading = false,
  error = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const markerGroupRef = useRef(null);

  const [tileWarning, setTileWarning] = useState(false);
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Type badge / color helper
  const getBadgeClass = (type) => {
    switch (type) {
      case 'Medical College': return 'mc';
      case 'District Hospital': return 'dh';
      case 'CHC': return 'chc';
      case 'PHC': default: return 'phc';
    }
  };

  const getPinIcon = (type, isSelected) => {
    const badgeClass = getBadgeClass(type);
    const iconName = type === 'Medical College' ? 'school' :
                     type === 'District Hospital' ? 'local_hospital' :
                     type === 'CHC' ? 'health_and_safety' : 'medical_services';

    return L.divIcon({
      className: 'custom-leaflet-div-icon',
      html: `
        <div class="custom-map-pin pin-${badgeClass} ${isSelected ? 'pin-selected' : ''}">
          <div class="custom-map-pin-inner">
            <span class="material-symbols-outlined">${iconName}</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Punjab / Moradabad regional expanse (North India)
      const map = L.map(mapContainerRef.current, {
        center: [30.5, 75.5],
        zoom: 7,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OSM Tile layer with offline error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors | GramHealth'
      });

      tileLayer.on('tileerror', () => {
        setTileWarning(true);
      });

      tileLayer.addTo(map);

      mapInstanceRef.current = map;
      markerGroupRef.current = L.featureGroup().addTo(map);
    }

    // Fix map container dimensions
    const resizeTimer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
    };
  }, []);

  // Update Markers when facilities list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    markersRef.current = {};

    const validFacilities = facilities.filter(
      (f) => typeof f.latitude === 'number' && typeof f.longitude === 'number' && !isNaN(f.latitude) && !isNaN(f.longitude)
    );

    if (validFacilities.length === 0) return;

    validFacilities.forEach((facility) => {
      const isSelected = selectedFacility && selectedFacility.id === facility.id;
      const icon = getPinIcon(facility.type, isSelected);

      const marker = L.marker([facility.latitude, facility.longitude], { icon });

      // Popup Content
      const badgeCls = getBadgeClass(facility.type);
      const popupHtml = `
        <div class="facility-popup-card">
          <div class="facility-popup-header">
            <h4 class="facility-popup-title">${facility.name}</h4>
            <span class="facility-popup-badge facility-popup-badge--${badgeCls}">${facility.type}</span>
          </div>
          <div class="facility-popup-district">
            <span class="material-symbols-outlined" style="font-size:14px">location_on</span>
            ${facility.district || 'Verified Regional'} District
          </div>
          <p class="facility-popup-address">${facility.address}</p>
          <div class="facility-popup-meta">
            <div class="facility-popup-meta-item">
              <span>Bed Availability</span>
              <strong>${facility.beds || 'Available'}</strong>
            </div>
            <div class="facility-popup-meta-item">
              <span>Operating Hours</span>
              <strong>${facility.hours || '24x7'}</strong>
            </div>
          </div>
          <div class="facility-popup-actions">
            ${facility.contactNumber ? `
              <a href="tel:${facility.contactNumber}" class="facility-popup-btn facility-popup-btn--call">
                <span class="material-symbols-outlined" style="font-size:16px">call</span>
                Call
              </a>
            ` : ''}
            <button id="btn-select-${facility.id}" class="facility-popup-btn facility-popup-btn--select">
              <span class="material-symbols-outlined" style="font-size:16px">task_alt</span>
              Select
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Handle popup select button click
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${facility.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectFacility) onSelectFacility(facility);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectFacility) onSelectFacility(facility);
      });

      marker.addTo(group);
      markersRef.current[facility.id] = marker;
    });

    // Auto fit bounds if facilities exist
    try {
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    } catch (e) {
      // Bounds empty
    }
  }, [facilities]);

  // Handle Selected Facility Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedFacility) return;

    if (
      typeof selectedFacility.latitude === 'number' &&
      typeof selectedFacility.longitude === 'number' &&
      !isNaN(selectedFacility.latitude)
    ) {
      map.setView([selectedFacility.latitude, selectedFacility.longitude], 13, {
        animate: true,
        duration: 0.8
      });

      const targetMarker = markersRef.current[selectedFacility.id];
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }, [selectedFacility]);

  // Fit all markers in view
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    if (!map || !group) return;

    const bounds = group.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  // Reset to default region view
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([30.5, 75.5], 7, { animate: true });
  };

  const validCount = facilities.filter(
    (f) => typeof f.latitude === 'number' && !isNaN(f.latitude)
  ).length;

  return (
    <div className="facility-map-wrapper">
      {/* Floating Controls */}
      <div className="map-floating-controls">
        <button
          type="button"
          className="map-control-btn"
          onClick={handleFitBounds}
          title="Zoom to fit all filtered facilities"
        >
          <span className="material-symbols-outlined">crop_free</span>
          Fit Facilities ({validCount})
        </button>
        <button
          type="button"
          className="map-control-btn"
          onClick={handleResetView}
          title="Reset map view"
        >
          <span className="material-symbols-outlined">refresh</span>
          Reset View
        </button>
      </div>

      {/* Offline Tile Notice */}
      {(!isOnline || tileWarning) && (
        <div className="map-offline-banner">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cloud_off</span>
          Offline Map Mode — Facility coordinates plotted from local storage
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="map-overlay-message">
          <span className="material-symbols-outlined">hourglass_top</span>
          <h4>Loading Healthcare Facilities...</h4>
          <p>Fetching verified geospatial coordinates</p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="map-overlay-message">
          <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>error</span>
          <h4>Unable to Load Facility Coordinates</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && validCount === 0 && (
        <div className="map-overlay-message">
          <span className="material-symbols-outlined">explore_off</span>
          <h4>No Facilities with GPS Coordinates Found</h4>
          <p>Try adjusting your search criteria or category filter</p>
        </div>
      )}

      {/* Map DOM Node */}
      <div ref={mapContainerRef} className="facility-map-container" id="gramhealth-leaflet-map" />
    </div>
  );
}
