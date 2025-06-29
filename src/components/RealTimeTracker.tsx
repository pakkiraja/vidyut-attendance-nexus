
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy: number;
}

interface RealTimeTrackerProps {
  isOfficeHours: boolean;
  onLocationUpdate?: (location: LocationData) => void;
}

const RealTimeTracker: React.FC<RealTimeTrackerProps> = ({ isOfficeHours, onLocationUpdate }) => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<LocationData[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

  const isWithinOffice = (location: LocationData) => {
    if (!user?.officeLocation) return false;
    
    const distance = calculateDistance(
      location.lat,
      location.lng,
      user.officeLocation.lat,
      user.officeLocation.lng
    );
    
    return distance <= user.officeLocation.radius;
  };

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

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(),
          accuracy: position.coords.accuracy
        };
        
        setCurrentLocation(locationData);
        setTrackingHistory(prev => [...prev.slice(-99), locationData]); // Keep last 100 locations
        onLocationUpdate?.(locationData);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    if (isOfficeHours && user?.role === 'employee') {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOfficeHours]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Location Tracking</CardTitle>
        <CardDescription>
          {isOfficeHours ? 'Tracking active during office hours' : 'Tracking inactive'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {currentLocation && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <Badge variant={isWithinOffice(currentLocation) ? "default" : "destructive"}>
                  {isWithinOffice(currentLocation) ? 'In Office' : 'Outside Office'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Coordinates:</span>
                <span className="font-mono text-sm">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy:</span>
                <span className="text-sm">±{Math.round(currentLocation.accuracy)}m</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Update:</span>
                <span className="text-sm">{currentLocation.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Tracking History: {trackingHistory.length} points</p>
            {!isTracking && (
              <Button onClick={startTracking} size="sm">
                Start Manual Tracking
              </Button>
            )}
            {isTracking && (
              <Button onClick={stopTracking} variant="outline" size="sm">
                Stop Tracking
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeTracker;
