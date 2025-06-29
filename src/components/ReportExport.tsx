
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Download, Mail } from 'lucide-react';

const ReportExport = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [reportPeriod, setReportPeriod] = useState('thisMonth');
  const [adminEmail, setAdminEmail] = useState('admin@vidyut.com');
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mock attendance data with location tracking
  const mockAttendanceData = [
    {
      employeeId: '1',
      name: 'John Doe',
      department: 'Engineering',
      date: '2024-01-15',
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      hours: '8h 45m',
      status: 'present',
      checkInLocation: { lat: 12.9716, lng: 77.5946 },
      checkOutLocation: { lat: 12.9716, lng: 77.5946 },
      trackingPoints: 145
    },
    {
      employeeId: '2',
      name: 'Jane Smith',
      department: 'Marketing',
      date: '2024-01-15',
      checkIn: '09:30 AM',
      checkOut: '06:15 PM',
      hours: '8h 15m',
      status: 'present',
      checkInLocation: { lat: 12.9716, lng: 77.5946 },
      checkOutLocation: { lat: 12.9716, lng: 77.5946 },
      trackingPoints: 132
    }
  ];

  const generateCSV = (data: any[]) => {
    const headers = [
      'Employee ID',
      'Name',
      'Department',
      'Date',
      'Check In',
      'Check Out',
      'Hours',
      'Status',
      'Check In Lat',
      'Check In Lng',
      'Check Out Lat',
      'Check Out Lng',
      'Tracking Points'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.employeeId,
        `"${row.name}"`,
        row.department,
        row.date,
        `"${row.checkIn}"`,
        `"${row.checkOut}"`,
        row.hours,
        row.status,
        row.checkInLocation.lat,
        row.checkInLocation.lng,
        row.checkOutLocation.lat,
        row.checkOutLocation.lng,
        row.trackingPoints
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const generatePDF = async (data: any[]) => {
    // This would integrate with a PDF library like jsPDF
    // For now, returning a mock PDF content
    return `PDF Report Generated for ${data.length} records`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filename = `attendance_report_${reportPeriod}_${new Date().toISOString().split('T')[0]}`;
      
      if (exportFormat === 'csv') {
        const csvContent = generateCSV(mockAttendanceData);
        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      } else if (exportFormat === 'pdf') {
        const pdfContent = await generatePDF(mockAttendanceData);
        // In real implementation, this would generate and download a PDF
        console.log('PDF generated:', pdfContent);
        toast({
          title: "PDF Export",
          description: "PDF generation would be implemented with a PDF library"
        });
      }

      toast({
        title: "Export Successful",
        description: `${exportFormat.toUpperCase()} report has been downloaded`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = async () => {
    // Mock API call to schedule monthly reports
    toast({
      title: "Schedule Set",
      description: `Monthly reports will be sent to ${adminEmail}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
        <CardDescription>
          Generate and export attendance reports with location tracking data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Report Period</label>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Generating Report...' : `Export ${exportFormat.toUpperCase()}`}
        </Button>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Auto-Schedule Monthly Reports</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Email</label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@company.com"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoSchedule"
                checked={autoSchedule}
                onCheckedChange={(checked) => setAutoSchedule(checked === true)}
              />
              <label htmlFor="autoSchedule" className="text-sm">
                Enable monthly auto-reports
              </label>
            </div>
            
            {autoSchedule && (
              <Button onClick={handleScheduleReport} variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Schedule Monthly Reports
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportExport;
