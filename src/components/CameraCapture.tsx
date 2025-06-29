
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFaceGuide, setShowFaceGuide] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setShowFaceGuide(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setShowFaceGuide(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      onCapture(imageData);
      stopCamera();
    }
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    onCapture('');
    startCamera();
  }, [startCamera, onCapture]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Identity Verification
        </CardTitle>
        <CardDescription>Capture a clear selfie for identity verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={startCamera} variant="outline">
              Try Again
            </Button>
          </div>
        ) : capturedImage ? (
          <div className="text-center">
            <div className="relative inline-block">
              <img 
                src={capturedImage} 
                alt="Captured selfie" 
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                Retake Photo
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled>
                ✓ Identity Verified
              </Button>
            </div>
          </div>
        ) : isStreaming ? (
          <div className="text-center">
            <div className="relative inline-block">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
              {/* Face guide overlay */}
              {showFaceGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-white border-dashed rounded-full w-48 h-48 flex items-center justify-center">
                    <User className="w-12 h-12 text-white opacity-50" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Position your face in the circle
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-2">Ready to capture your identity photo</p>
              <p className="text-sm text-gray-500">Make sure you're in good lighting</p>
            </div>
            <Button onClick={startCamera} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
