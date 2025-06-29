
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AttendanceCard from '../components/AttendanceCard';
import LocationTracker from '../components/LocationTracker';
import CameraCapture from '../components/CameraCapture';
import RealTimeTracker from '../components/RealTimeTracker';
import NotificationCenter from '../components/NotificationCenter';
import LocationMap from '../components/LocationMap';
import AnimatedAttendanceButtons from '../components/AnimatedAttendanceButtons';
import { toast } from '@/hooks/use-toast';

interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  type: 'checkin' | 'checkout' | 'tracking';
}

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isOfficeHours, setIsOfficeHours] = useState(false);
  const [trackingPoints, setTrackingPoints] = useState<LocationPoint[]>([]);

  // Check if current time is office hours (9 AM - 6 PM)
  useEffect(() => {
    const checkOfficeHours = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsOfficeHours(hour >= 9 && hour < 18);
    };

    checkOfficeHours();
    const interval = setInterval(checkOfficeHours, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleLocationUpdate = (coords: {lat: number, lng: number}) => {
    setLocation(coords);
  };

  const handleSelfieCapture = (imageData: string) => {
    setSelfieData(imageData);
  };

  const handleCheckIn = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location access to check in",
        variant: "destructive"
      });
      return;
    }

    if (!selfieData) {
      toast({
        title: "Selfie Required",
        description: "Please capture a selfie to verify your identity",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingIn(true);
    
    // Mock API call
    setTimeout(() => {
      const attendance = {
        id: Date.now().toString(),
        userId: user?.id,
        checkIn: new Date(),
        location: location,
        selfie: selfieData,
        status: 'present'
      };
      
      // Add check-in tracking point
      const checkInPoint: LocationPoint = {
        lat: location.lat,
        lng: location.lng,
        timestamp: new Date(),
        type: 'checkin'
      };
      setTrackingPoints(prev => [...prev, checkInPoint]);
      
      setTodayAttendance(attendance);
      setIsCheckingIn(false);
      
      toast({
        title: "Check-in Successful",
        description: "Your attendance has been recorded",
      });
    }, 2000);
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;

    setIsCheckingIn(true);
    
    // Mock API call
    setTimeout(() => {
      // Add check-out tracking point
      if (location) {
        const checkOutPoint: LocationPoint = {
          lat: location.lat,
          lng: location.lng,
          timestamp: new Date(),
          type: 'checkout'
        };
        setTrackingPoints(prev => [...prev, checkOutPoint]);
      }

      setTodayAttendance(prev => ({
        ...prev,
        checkOut: new Date()
      }));
      setIsCheckingIn(false);
      
      toast({
        title: "Check-out Successful",
        description: "Your checkout has been recorded",
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          {isOfficeHours && (
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium">Office Hours Active</div>
              <div className="text-xs text-gray-500">Real-time tracking enabled</div>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NotificationCenter />
          </div>
          <AttendanceCard 
            attendance={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isLoading={isCheckingIn}
          />
        </div>

        {/* Animated Check-in/out Section */}
        <Card>
          <CardContent className="py-8">
            <AnimatedAttendanceButtons
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isLoading={isCheckingIn}
              hasCheckedIn={!!todayAttendance && !todayAttendance.checkOut}
              isLocationLocked={!!location}
              hasSelfie={!!selfieData}
            />
          </CardContent>
        </Card>

        {/* Location and Selfie Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
          <CameraCapture onCapture={handleSelfieCapture} />
        </div>

        {/* Real-time Tracking and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealTimeTracker 
            isOfficeHours={isOfficeHours}
            onLocationUpdate={(locationData) => {
              console.log('Real-time location:', locationData);
              // Add tracking point during office hours
              if (isOfficeHours) {
                const trackingPoint: LocationPoint = {
                  lat: locationData.lat,
                  lng: locationData.lng,
                  timestamp: locationData.timestamp,
                  type: 'tracking'
                };
                setTrackingPoints(prev => [...prev.slice(-99), trackingPoint]); // Keep last 100 points
              }
            }}
          />
          <LocationMap
            currentLocation={location}
            trackingPoints={trackingPoints}
            onLocationUpdate={handleLocationUpdate}
          />
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">22</p>
                <p className="text-sm text-green-700">Days Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-red-700">Days Absent</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">91.7%</p>
                <p className="text-sm text-blue-700">Attendance Rate</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">8h 15m</p>
                <p className="text-sm text-yellow-700">Avg Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
