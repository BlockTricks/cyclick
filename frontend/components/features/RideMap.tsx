'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Position {
  lat: number
  lng: number
  timestamp: number
}

interface RideMapProps {
  route: Position[]
  currentPosition: Position | null
  isTracking: boolean
}

export default function RideMap({ route, currentPosition, isTracking }: RideMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const startMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      })

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)

      // Set initial view (default to a central location, will update when we have position)
      mapRef.current.setView([51.505, -0.09], 13)
    }

    const map = mapRef.current

    // Update map view when we get first position
    if (route.length > 0 && !startMarkerRef.current) {
      const firstPos = route[0]
      map.setView([firstPos.lat, firstPos.lng], 15)
      
      // Add start marker
      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: '<div style="background-color: #35D07F; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
      
      startMarkerRef.current = L.marker([firstPos.lat, firstPos.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup('Start')
    }

    // Update route polyline
    if (route.length > 1) {
      const latlngs = route.map(pos => [pos.lat, pos.lng] as [number, number])
      
      if (routeLayerRef.current) {
        routeLayerRef.current.setLatLngs(latlngs)
      } else {
        routeLayerRef.current = L.polyline(latlngs, {
          color: '#35D07F',
          weight: 4,
          opacity: 0.8,
        }).addTo(map)
      }
      
      // Fit map to route
      if (route.length > 2) {
        const bounds = L.latLngBounds(latlngs)
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }

    // Update current position marker
    if (currentPosition && isTracking) {
      const currentIcon = L.divIcon({
        className: 'custom-current-marker',
        html: '<div style="background-color: #EF4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      if (markerRef.current) {
        markerRef.current.setLatLng([currentPosition.lat, currentPosition.lng])
      } else {
        markerRef.current = L.marker([currentPosition.lat, currentPosition.lng], { icon: currentIcon })
          .addTo(map)
          .bindPopup('Current Position')
      }
    }

    return () => {
      // Cleanup is handled by component unmount
    }
  }, [route, currentPosition, isTracking])

  // Add CSS for pulse animation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return <div ref={mapContainerRef} className="w-full h-full" />
}
