
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AttendanceCard from '../components/AttendanceCard';
import LocationTracker from '../components/LocationTracker';
import RealTimeTracker from '../components/RealTimeTracker';
import NotificationCenter from '../components/NotificationCenter';
import AnimatedAttendanceButtons from '../components/AnimatedAttendanceButtons';
import PasswordManager from '../components/PasswordManager';
import { Calendar, Clock, MapPin, User, Users, CheckCircle, XCircle, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for dashboard
  const todayStats = {
    present: 23,
    absent: 2,
    late: 3,
    onTime: 20
  };

  const notifications = [
    {
      id: 1,
      type: 'birthday' as const,
      title: 'Birthday Today!',
      message: 'John Doe is celebrating his birthday today. Wish him well!',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'announcement' as const,
      title: 'Office Notes',
      message: 'Monthly team meeting scheduled for tomorrow at 10 AM in Conference Room A.',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'system' as const,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur this weekend from 2 AM to 4 AM.',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName || user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <User className="w-4 h-4 mr-2" />
            {user?.role === 'admin' ? 'Administrator' : 'Employee'}
          </Badge>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-medium">{user?.employeeId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{user?.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium">{user?.project || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Work Location</p>
              <p className="font-medium">{user?.workLocation || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard */}
        {user?.role === 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{todayStats.present}</p>
                    <p className="text-sm text-gray-600">Present Today</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{todayStats.absent}</p>
                    <p className="text-sm text-gray-600">Absent Today</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{todayStats.late}</p>
                    <p className="text-sm text-gray-600">Late Arrivals</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{todayStats.onTime}</p>
                    <p className="text-sm text-gray-600">On Time</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Employee Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <AnimatedAttendanceButtons />
              <AttendanceCard />
              <PasswordManager />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <NotificationCenter notifications={notifications} />
              <LocationTracker />
              <RealTimeTracker />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
