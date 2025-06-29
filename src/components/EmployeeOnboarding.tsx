
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

interface EmployeeOnboardingProps {
  onEmployeeAdd: (employee: any) => void;
}

const EmployeeOnboarding: React.FC<EmployeeOnboardingProps> = ({ onEmployeeAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    department: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock employee creation
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeForm,
      role: 'employee',
      isApproved: true,
      officeLocation,
      createdAt: new Date()
    };

    // Simulate API call
    setTimeout(() => {
      onEmployeeAdd(newEmployee);
      setEmployeeForm({ name: '', email: '', department: '', password: '' });
      setIsOpen(false);
      setIsLoading(false);
      toast({
        title: "Employee Added",
        description: `${newEmployee.name} has been successfully onboarded`
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Employee</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Onboarding</DialogTitle>
          <DialogDescription>
            Add a new employee and configure their office location
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Full Name"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <Input
              type="password"
              placeholder="Temporary Password"
              value={employeeForm.password}
              onChange={(e) => setEmployeeForm(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

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
