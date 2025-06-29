
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import EmployeeOnboarding from '../components/EmployeeOnboarding';
import ReportExport from '../components/ReportExport';
import SmtpSettings from '../components/SmtpSettings';

const AdminConsole = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'admin_001',
      employeeId: 'ADN001',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      email: 'vadmin@vidyutconsultancy.in',
      department: 'IT',
      project: 'System Administration',
      workLocation: 'Bangalore Office',
      contactNumber: '+91 9876543210',
      role: 'admin',
      status: 'active',
      lastSeen: new Date(),
      officeLocation: { lat: 12.9716, lng: 77.5946, radius: 100 }
    }
  ]);

  const handleEmployeeAdd = (newEmployee: any) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    
    // Also remove from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('vidyut_employees') || '[]');
    const updatedEmployees = storedEmployees.filter((emp: any) => emp.id !== employeeId);
    localStorage.setItem('vidyut_employees', JSON.stringify(updatedEmployees));
    
    toast({
      title: "Employee Removed",
      description: "Employee has been removed from the system",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
            <p className="text-gray-600 mt-1">Manage employees and system settings</p>
          </div>
          <EmployeeOnboarding onEmployeeAdd={handleEmployeeAdd} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
              <p className="text-sm text-gray-600">Total Employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">23</div>
              <p className="text-sm text-gray-600">Present Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-sm text-gray-600">Absent Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">85%</div>
              <p className="text-sm text-gray-600">In Office Now</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Export</TabsTrigger>
            <TabsTrigger value="settings">Email Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage employees and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Work Location</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-mono">{employee.employeeId || 'N/A'}</TableCell>
                          <TableCell className="font-medium">{employee.fullName}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.project || 'N/A'}</TableCell>
                          <TableCell>{employee.workLocation || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                              {employee.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {employee.role !== 'admin' && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportExport />
          </TabsContent>

          <TabsContent value="settings">
            <SmtpSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminConsole;
