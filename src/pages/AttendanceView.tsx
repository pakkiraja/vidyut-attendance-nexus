
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AttendanceView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock attendance data
  const attendanceRecords = [
    {
      date: '2024-01-15',
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      hours: '8h 45m',
      status: 'present' as const,
      location: 'Office'
    },
    {
      date: '2024-01-14',
      checkIn: '09:30 AM',
      checkOut: '06:15 PM',
      hours: '8h 15m',
      status: 'present' as const,
      location: 'Office'
    },
    {
      date: '2024-01-13',
      checkIn: '10:00 AM',
      checkOut: '07:00 PM',
      hours: '8h 30m',
      status: 'late' as const,
      location: 'Office'
    },
    {
      date: '2024-01-12',
      checkIn: '-',
      checkOut: '-',
      hours: '0h',
      status: 'absent' as const,
      location: '-'
    }
  ];

  const getStatusBadge = (status: 'present' | 'late' | 'absent') => {
    const variants = {
      present: 'default' as const,
      late: 'secondary' as const,
      absent: 'destructive' as const
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
            <p className="text-gray-600 mt-1">View your attendance records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Your recent attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.hours}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">22</div>
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-sm text-gray-600">Late Arrivals</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">8h 20m</div>
              <p className="text-sm text-gray-600">Avg Daily Hours</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceView;
