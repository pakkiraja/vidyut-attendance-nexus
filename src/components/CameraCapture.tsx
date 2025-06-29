
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        <CardTitle>Selfie Verification</CardTitle>
        <CardDescription>Capture a selfie to verify your identity</CardDescription>
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
            <img 
              src={capturedImage} 
              alt="Captured selfie" 
              className="w-full max-w-sm mx-auto rounded-lg shadow-md"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                Retake
              </Button>
              <Button className="flex-1" disabled>
                ✓ Captured
              </Button>
            </div>
          </div>
        ) : isStreaming ? (
          <div className="text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-sm mx-auto rounded-lg shadow-md"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={capturePhoto} className="flex-1">
                Capture
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Ready to capture your selfie</p>
            <Button onClick={startCamera} className="w-full">
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
