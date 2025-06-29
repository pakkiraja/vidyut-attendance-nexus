
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LocationTrackerProps {
  onLocationUpdate: (coords: {lat: number, lng: number}) => void;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWithinOffice, setIsWithinOffice] = useState(false);

  // Mock office coordinates (replace with actual office location)
  const OFFICE_COORDS = { lat: 12.9716, lng: 77.5946 }; // Bangalore coordinates
  const OFFICE_RADIUS = 100; // 100 meters

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation(coords);
        onLocationUpdate(coords);
        
        // Check if within office radius
        const distance = calculateDistance(
          coords.lat, coords.lng,
          OFFICE_COORDS.lat, OFFICE_COORDS.lng
        );
        
        setIsWithinOffice(distance <= OFFICE_RADIUS);
        setIsLoading(false);
      },
      (error) => {
        setError('Unable to retrieve location: ' + error.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Verification</CardTitle>
        <CardDescription>Verify your location for attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={getCurrentLocation} variant="outline">
              Retry Location Access
            </Button>
          </div>
        ) : location ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={isWithinOffice ? "default" : "destructive"}>
                  {isWithinOffice ? 'Within Office Area' : 'Outside Office Area'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latitude:</span>
                <span className="font-mono text-sm">{location.lat.toFixed(6)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longitude:</span>
                <span className="font-mono text-sm">{location.lng.toFixed(6)}</span>
              </div>
            </div>
            
            <Button 
              onClick={getCurrentLocation} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Refresh Location'}
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Getting your location...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTracker;
