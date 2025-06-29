
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Camera, Clock } from 'lucide-react';

interface AnimatedAttendanceButtonsProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  isLoading: boolean;
  hasCheckedIn: boolean;
  isLocationLocked: boolean;
  hasSelfie: boolean;
}

const AnimatedAttendanceButtons: React.FC<AnimatedAttendanceButtonsProps> = ({
  onCheckIn,
  onCheckOut,
  isLoading,
  hasCheckedIn,
  isLocationLocked,
  hasSelfie
}) => {
  const [isCheckInAnimating, setIsCheckInAnimating] = useState(false);
  const [isCheckOutAnimating, setIsCheckOutAnimating] = useState(false);

  const handleCheckIn = () => {
    if (!isLocationLocked || !hasSelfie) return;
    
    setIsCheckInAnimating(true);
    setTimeout(() => setIsCheckInAnimating(false), 1000);
    onCheckIn();
  };

  const handleCheckOut = () => {
    setIsCheckOutAnimating(true);
    setTimeout(() => setIsCheckOutAnimating(false), 1000);
    onCheckOut();
  };

  const checkInButtonClass = `
    relative overflow-hidden rounded-full w-32 h-32 transition-all duration-300 transform
    ${isCheckInAnimating ? 'scale-110 animate-pulse' : 'hover:scale-105'}
    ${!isLocationLocked || !hasSelfie ? 'opacity-50 cursor-not-allowed' : ''}
    ${hasCheckedIn ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
  `;

  const checkOutButtonClass = `
    relative overflow-hidden rounded-full w-32 h-32 transition-all duration-300 transform
    ${isCheckOutAnimating ? 'scale-110 animate-pulse' : 'hover:scale-105'}
    ${!hasCheckedIn ? 'opacity-50 cursor-not-allowed' : ''}
    bg-red-500 hover:bg-red-600
  `;

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Attendance Control</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className={`flex items-center gap-1 ${isLocationLocked ? 'text-green-600' : 'text-red-600'}`}>
            <MapPin className="w-4 h-4" />
            <span>{isLocationLocked ? 'Location Locked' : 'Location Required'}</span>
          </div>
          <div className={`flex items-center gap-1 ${hasSelfie ? 'text-green-600' : 'text-red-600'}`}>
            <Camera className="w-4 h-4" />
            <span>{hasSelfie ? 'Selfie Captured' : 'Selfie Required'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-center">
        {/* Check In Button */}
        <div className="text-center">
          <Button
            className={checkInButtonClass}
            onClick={handleCheckIn}
            disabled={isLoading || hasCheckedIn || !isLocationLocked || !hasSelfie}
          >
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">
                {hasCheckedIn ? 'Checked In' : 'Check In'}
              </span>
            </div>
            {/* Animated ring effect */}
            <div className={`
              absolute inset-0 rounded-full border-4 border-white 
              ${isCheckInAnimating ? 'animate-ping opacity-75' : 'opacity-0'}
            `} />
          </Button>
          <p className="text-xs text-gray-500 mt-2">Tap to check in</p>
        </div>

        {/* Check Out Button */}
        <div className="text-center">
          <Button
            className={checkOutButtonClass}
            onClick={handleCheckOut}
            disabled={isLoading || !hasCheckedIn}
          >
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Check Out</span>
            </div>
            {/* Animated ring effect */}
            <div className={`
              absolute inset-0 rounded-full border-4 border-white 
              ${isCheckOutAnimating ? 'animate-ping opacity-75' : 'opacity-0'}
            `} />
          </Button>
          <p className="text-xs text-gray-500 mt-2">Tap to check out</p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          hasCheckedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            hasCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span>{hasCheckedIn ? 'Currently Checked In' : 'Not Checked In'}</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAttendanceButtons;
