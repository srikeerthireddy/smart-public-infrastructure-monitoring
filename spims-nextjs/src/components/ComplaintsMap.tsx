'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Complaint } from '@/types';

// Fix Leaflet default icon issue with Next.js
const createIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const redIcon = createIcon('#ef4444');
const yellowIcon = createIcon('#eab308');
const greenIcon = createIcon('#22c55e');

function getMarkerIcon(status: string) {
  switch (status) {
    case 'reported':
      return redIcon;
    case 'in_progress':
      return yellowIcon;
    case 'resolved':
      return greenIcon;
    default:
      return createIcon('#6b7280');
  }
}

function FitBounds({ complaints }: { complaints: Complaint[] }) {
  const map = useMap();
  const hasRun = useRef(false);

  useEffect(() => {
    if (complaints.length > 0 && !hasRun.current) {
      const valid = complaints.filter((c) => c.latitude && c.longitude);
      if (valid.length > 0) {
        const bounds = L.latLngBounds(
          valid.map((c) => [c.latitude, c.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        hasRun.current = true;
      }
    }
  }, [complaints, map]);

  return null;
}

interface ComplaintsMapProps {
  complaints: Complaint[];
  statusFilter: 'all' | 'reported' | 'in_progress' | 'resolved';
  selectedComplaint: Complaint | null;
  onSelectComplaint: (c: Complaint | null) => void;
}

export default function ComplaintsMap({
  complaints,
  statusFilter,
  selectedComplaint,
  onSelectComplaint,
}: ComplaintsMapProps) {
  const filtered = complaints.filter(
    (c) => statusFilter === 'all' || c.status === statusFilter
  );
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai, India
  const defaultZoom = 10;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full z-0"
      style={{ height: '100%', minHeight: 400 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds complaints={filtered} />
      {filtered.map((complaint) => (
        <Marker
          key={complaint.id}
          position={[complaint.latitude, complaint.longitude]}
          eventHandlers={{
            click: () => onSelectComplaint(complaint),
          }}
          icon={getMarkerIcon(complaint.status)}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-1">{complaint.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {complaint.location || `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  complaint.status === 'reported'
                    ? 'bg-red-100 text-red-800'
                    : complaint.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {complaint.status.replace('_', ' ')}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
