"use client";

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // @ts-ignore - leaflet.heat adds heatLayer to L
    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 15,
      maxZoom: 14,
      gradient: {
        0.2: '#06b6d4', // Cyan
        0.4: '#10b981', // Green
        0.6: '#f59e0b', // Yellow
        0.8: '#f97316', // Orange
        1.0: '#e11d48'  // Red
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
