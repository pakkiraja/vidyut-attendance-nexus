
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

const AdminConsole = () => {
  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@vidyut.com',
      department: 'IT',
      role: 'admin',
      status: 'active',
      lastSeen: new Date(),
      officeLocation: { lat: 12.9716, lng: 77.5946, radius: 100 }
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'employee@vidyut.com',
      department: 'Engineering',
      role: 'employee',
      status: 'active',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      officeLocation: { lat: 12.9716, lng: 77.5946, radius: 100 }
    }
  ]);

  const handleEmployeeAdd = (newEmployee: any) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage employees and their office locations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Office Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {employee.officeLocation ? 
                            `${employee.officeLocation.lat.toFixed(4)}, ${employee.officeLocation.lng.toFixed(4)}` 
                            : 'Not set'
                          }
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportExport />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminConsole;
