
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const DEPARTMENTS = [
  'IT',
  'Engineering', 
  'Finance',
  'Projects',
  'HR',
  'Operations'
];

const PROJECTS = [
  'Project Alpha',
  'Project Beta',
  'Project Gamma',
  'Project Delta',
  'Maintenance',
  'R&D'
];

const WORK_LOCATIONS = [
  'Bangalore Office',
  'Mumbai Office',
  'Delhi Office',
  'Chennai Office',
  'Remote',
  'Hybrid'
];

interface EmployeeOnboardingProps {
  onEmployeeAdd: (employee: any) => void;
}

const EmployeeOnboarding: React.FC<EmployeeOnboardingProps> = ({ onEmployeeAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    initials: '',
    fullName: '',
    department: '',
    project: '',
    workLocation: '',
    contactNumber: '',
    email: '',
    password: ''
  });

  const [officeLocation, setOfficeLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    radius: 100,
    address: ''
  });

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOfficeLocation(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          toast({
            title: "Location Detected",
            description: "Current location set as office location"
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not detect location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const generateFullName = () => {
    const fullName = `${employeeForm.firstName} ${employeeForm.lastName}`.trim();
    setEmployeeForm(prev => ({ ...prev, fullName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newEmployee = {
      id: Date.now().toString(),
      ...employeeForm,
      role: 'employee',
      isApproved: true,
      officeLocation,
      createdAt: new Date()
    };

    // Store employee in localStorage (simulated database)
    const existingEmployees = JSON.parse(localStorage.getItem('vidyut_employees') || '[]');
    existingEmployees.push(newEmployee);
    localStorage.setItem('vidyut_employees', JSON.stringify(existingEmployees));

    setTimeout(() => {
      onEmployeeAdd(newEmployee);
      setEmployeeForm({
        employeeId: '',
        firstName: '',
        lastName: '',
        initials: '',
        fullName: '',
        department: '',
        project: '',
        workLocation: '',
        contactNumber: '',
        email: '',
        password: ''
      });
      setIsOpen(false);
      setIsLoading(false);
      toast({
        title: "Employee Added",
        description: `${newEmployee.fullName} has been successfully onboarded`
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Employee</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Onboarding</DialogTitle>
          <DialogDescription>
            Add a new employee with complete details and configure their office location
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Employee ID</label>
                <Input
                  placeholder="EMP001"
                  value={employeeForm.employeeId}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="employee@vidyutconsultancy.in"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">First Name</label>
                <Input
                  placeholder="John"
                  value={employeeForm.firstName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
                  onBlur={generateFullName}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={employeeForm.lastName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                  onBlur={generateFullName}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Initials</label>
                <Input
                  placeholder="J.D"
                  value={employeeForm.initials}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, initials: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input
                  placeholder="John Doe"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contact Number</label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={employeeForm.contactNumber}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Temporary Password</label>
                <Input
                  type="password"
                  placeholder="Enter temporary password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Department</label>
                <Select onValueChange={(value) => setEmployeeForm(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Project</label>
                <Select onValueChange={(value) => setEmployeeForm(prev => ({ ...prev, project: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Work Location</label>
                <Select onValueChange={(value) => setEmployeeForm(prev => ({ ...prev, workLocation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Work Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATIONS.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Office Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Office Location</CardTitle>
              <CardDescription>Configure the office location for attendance tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={officeLocation.lat}
                  onChange={(e) => setOfficeLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={officeLocation.lng}
                  onChange={(e) => setOfficeLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Radius (m)"
                  value={officeLocation.radius}
                  onChange={(e) => setOfficeLocation(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                />
              </div>
              <Input
                placeholder="Office Address"
                value={officeLocation.address}
                onChange={(e) => setOfficeLocation(prev => ({ ...prev, address: e.target.value }))}
              />
              <Button type="button" onClick={handleLocationDetect} variant="outline">
                Use Current Location
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding Employee...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeOnboarding;
