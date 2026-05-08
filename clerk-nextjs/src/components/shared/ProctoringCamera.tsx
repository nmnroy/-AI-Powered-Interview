"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { toast } from "sonner";

export interface ProctoringStats {
  tabSwitches: number;
  noFaceWarnings: number;
  multipleFaceWarnings: number;
  sessionDuration: number;
}

interface ProctoringCameraProps {
  isActive: boolean;
  onStatsUpdate: (stats: Pick<ProctoringStats, "noFaceWarnings" | "multipleFaceWarnings" | "sessionDuration">) => void;
}

export default function ProctoringCamera({ isActive, onStatsUpdate }: ProctoringCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const statsRef = useRef({
    noFaceWarnings: 0,
    multipleFaceWarnings: 0,
    sessionDuration: 0,
  });

  const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights";

  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        
        // Reset stats when starting
        statsRef.current = { noFaceWarnings: 0, multipleFaceWarnings: 0, sessionDuration: 0 };
        onStatsUpdate(statsRef.current);
        
        // Start duration timer
        const durationInterval = window.setInterval(() => {
          statsRef.current.sessionDuration += 1;
          onStatsUpdate({ ...statsRef.current });
        }, 1000);

        // Start face detection
        intervalRef.current = window.setInterval(async () => {
          if (videoRef.current) {
            const detections = await faceapi.detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            );

            if (detections.length === 0) {
              statsRef.current.noFaceWarnings += 1;
              toast.warning("⚠ No face detected. Please stay in frame.");
              if (statsRef.current.noFaceWarnings === 3) {
                toast.error("Proctoring Alert: You left the frame 3 times. This will be noted in your session report.", {
                  duration: 5000,
                });
              }
            } else if (detections.length > 1) {
              statsRef.current.multipleFaceWarnings += 1;
              toast.warning("⚠ Multiple faces detected.");
            }
            
            onStatsUpdate({ ...statsRef.current });
          }
        }, 3000);

        // Cleanup
        return () => {
          clearInterval(durationInterval);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
        toast.error("Camera access denied. Proctoring disabled. Practice will continue without monitoring.", {
          duration: 5000,
        });
      }
    };

    if (isActive) {
      startCamera().then((cleanup) => {
        if (cleanup && !mounted) cleanup();
      });
    } else {
      // Stop camera if not active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onStatsUpdate]);

  if (!isActive) return null;

  if (hasPermission === false) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-lg text-sm z-50">
        Camera access denied. Proctoring disabled.
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-32 h-12' : 'w-[200px] h-[150px]'}`} 
         style={{ background: '#0a0f1e', border: '1px solid #1e2d4a', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-black/50 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-medium uppercase tracking-wider">Live</span>
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMinimized ? '□' : '—'}
        </button>
      </div>

      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${isMinimized ? 'opacity-0' : 'opacity-100'}`}
        style={{ transform: 'scaleX(-1)' }}
      />
    </div>
  );
}
