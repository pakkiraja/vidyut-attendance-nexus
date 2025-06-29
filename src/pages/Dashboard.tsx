
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AttendanceCard from '../components/AttendanceCard';
import LocationTracker from '../components/LocationTracker';
import CameraCapture from '../components/CameraCapture';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceCard 
            attendance={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isLoading={isCheckingIn}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your attendance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
          <CameraCapture onCapture={handleSelfieCapture} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
