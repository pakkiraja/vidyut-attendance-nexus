
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Gift, FileText, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'office_note' | 'birthday' | 'general';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'office_note',
      title: 'Office Maintenance',
      message: 'Office maintenance scheduled for this weekend. Please save your work.',
      date: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'birthday',
      title: 'Birthday Today! 🎉',
      message: 'Wish Sarah from HR a happy birthday today!',
      date: new Date(),
      read: false
    },
    {
      id: '3',
      type: 'general',
      title: 'Team Meeting',
      message: 'Monthly team meeting scheduled for 3 PM in conference room A.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'office_note':
        return <FileText className="w-4 h-4" />;
      case 'birthday':
        return <Gift className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'office_note':
        return 'bg-blue-50 border-blue-200';
      case 'birthday':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Stay updated with office announcements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
                !notification.read ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      ✓
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
