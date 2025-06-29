
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Mail, Settings } from 'lucide-react';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

const SmtpSettings = () => {
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: '',
    port: 587,
    secure: false,
    user: '',
    password: '',
    from: ''
  });
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (field: keyof SmtpConfig, value: string | number | boolean) => {
    setSmtpConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real application, this would save to the database
    console.log('Saving SMTP settings:', smtpConfig);
    toast({
      title: "SMTP Settings Saved",
      description: "Email notification settings have been updated",
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    // Mock test connection
    setTimeout(() => {
      setIsTesting(false);
      toast({
        title: "Connection Test",
        description: "SMTP connection test successful",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          SMTP Email Settings
        </CardTitle>
        <CardDescription>
          Configure email settings for attendance reports and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input
              id="smtp-host"
              type="text"
              placeholder="smtp.gmail.com"
              value={smtpConfig.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp-port">Port</Label>
            <Input
              id="smtp-port"
              type="number"
              placeholder="587"
              value={smtpConfig.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 587)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp-user">Username/Email</Label>
            <Input
              id="smtp-user"
              type="email"
              placeholder="your-email@gmail.com"
              value={smtpConfig.user}
              onChange={(e) => handleInputChange('user', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp-password">Password/App Password</Label>
            <Input
              id="smtp-password"
              type="password"
              placeholder="Your email password"
              value={smtpConfig.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="smtp-from">From Email Address</Label>
            <Input
              id="smtp-from"
              type="email"
              placeholder="noreply@company.com"
              value={smtpConfig.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSaveSettings} className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          <Button 
            onClick={handleTestConnection} 
            variant="outline" 
            disabled={isTesting || !smtpConfig.host || !smtpConfig.user}
            className="flex-1"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Note:</strong> For Gmail, use an App Password instead of your regular password.</p>
          <p>Enable 2-factor authentication and generate an App Password in your Google Account settings.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmtpSettings;
