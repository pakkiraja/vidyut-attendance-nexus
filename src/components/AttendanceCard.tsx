
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AttendanceCardProps {
  attendance: any;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isLoading: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  onCheckIn,
  onCheckOut,
  isLoading
}) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWorkingHours = () => {
    if (!attendance?.checkIn) return '0h 0m';
    
    const checkInTime = new Date(attendance.checkIn);
    const checkOutTime = attendance.checkOut ? new Date(attendance.checkOut) : new Date();
    const diff = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>Track your working hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {attendance ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant={attendance.checkOut ? "secondary" : "default"}>
                {attendance.checkOut ? 'Checked Out' : 'Checked In'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Check In:</span>
                <span className="font-medium">{formatTime(attendance.checkIn)}</span>
              </div>
              
              {attendance.checkOut && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Check Out:</span>
                  <span className="font-medium">{formatTime(attendance.checkOut)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Working Hours:</span>
                <span className="font-medium">{getWorkingHours()}</span>
              </div>
            </div>
            
            {!attendance.checkOut && (
              <Button 
                onClick={onCheckOut} 
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Processing...' : 'Check Out'}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't checked in today</p>
              <Button 
                onClick={onCheckIn} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Check In'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
