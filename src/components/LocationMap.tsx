
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  type: 'checkin' | 'checkout' | 'tracking';
}

interface LocationMapProps {
  currentLocation: {lat: number, lng: number} | null;
  trackingPoints: LocationPoint[];
  onLocationUpdate: (coords: {lat: number, lng: number}) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  currentLocation, 
  trackingPoints, 
  onLocationUpdate 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);

  const loadGoogleMapsScript = () => {
    if (!googleApiKey) return;
    
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !currentLocation) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: currentLocation,
      zoom: 16,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add current location marker
    new window.google.maps.Marker({
      position: currentLocation,
      map: mapInstance,
      title: 'Current Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    });

    // Add tracking points
    trackingPoints.forEach((point, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapInstance,
        title: `${point.type} - ${point.timestamp.toLocaleTimeString()}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="4" fill="${point.type === 'checkin' ? '#10B981' : point.type === 'checkout' ? '#EF4444' : '#6B7280'}" stroke="white" stroke-width="1"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(12, 12)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <p class="font-medium">${point.type.toUpperCase()}</p>
            <p class="text-sm text-gray-600">${point.timestamp.toLocaleString()}</p>
            <p class="text-xs text-gray-500">${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    });

    // Draw path if there are multiple points
    if (trackingPoints.length > 1) {
      const path = trackingPoints.map(point => ({ lat: point.lat, lng: point.lng }));
      new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: mapInstance
      });
    }

    setMap(mapInstance);
  };

  useEffect(() => {
    if (googleApiKey) {
      loadGoogleMapsScript();
    }
  }, [googleApiKey]);

  useEffect(() => {
    if (isMapLoaded && currentLocation) {
      initializeMap();
    }
  }, [isMapLoaded, currentLocation, trackingPoints]);

  if (!googleApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Tracking Map
          </CardTitle>
          <CardDescription>Enter Google Maps API key to view location tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Google Maps API Key</label>
            <Input
              type="password"
              placeholder="Enter your Google Maps API key"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
            />
          </div>
          <Button onClick={loadGoogleMapsScript} disabled={!googleApiKey} className="w-full">
            Load Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Real-time Location Tracking
        </CardTitle>
        <CardDescription>
          Track your location with {trackingPoints.length} tracking points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border"
          style={{ minHeight: '256px' }}
        >
          {!isMapLoaded && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        {trackingPoints.length > 0 && (
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Check-in</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Check-out</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Tracking</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
