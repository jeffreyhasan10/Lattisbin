
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface NavigationState {
  currentPosition: GPSPosition | null;
  isTracking: boolean;
  isOnline: boolean;
  batteryOptimized: boolean;
  trackingAccuracy: 'high' | 'medium' | 'low';
  lastUpdate: Date | null;
}

export interface NavigationContextType {
  navigationState: NavigationState;
  startTracking: () => Promise<boolean>;
  stopTracking: () => void;
  updateTrackingAccuracy: (accuracy: 'high' | 'medium' | 'low') => void;
  getCurrentPosition: () => Promise<GPSPosition | null>;
  watchPosition: (callback: (position: GPSPosition) => void) => number;
  clearWatch: (watchId: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPosition: null,
    isTracking: false,
    isOnline: navigator.onLine,
    batteryOptimized: false,
    trackingAccuracy: 'high',
    lastUpdate: null,
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setNavigationState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setNavigationState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getGeolocationOptions = (accuracy: 'high' | 'medium' | 'low') => {
    const options: PositionOptions = {
      enableHighAccuracy: accuracy === 'high',
      timeout: accuracy === 'high' ? 10000 : 5000,
      maximumAge: accuracy === 'high' ? 1000 : accuracy === 'medium' ? 5000 : 10000,
    };
    return options;
  };

  const startTracking = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by this browser');
      return false;
    }

    try {
      const position = await getCurrentPosition();
      if (position) {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const gpsPosition: GPSPosition = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              speed: pos.coords.speed || undefined,
              heading: pos.coords.heading || undefined,
              timestamp: pos.timestamp,
            };

            setNavigationState(prev => ({
              ...prev,
              currentPosition: gpsPosition,
              lastUpdate: new Date(),
            }));
          },
          (error) => {
            console.error('GPS tracking error:', error);
            toast.error('GPS tracking failed: ' + error.message);
          },
          getGeolocationOptions(navigationState.trackingAccuracy)
        );

        setWatchId(id);
        setNavigationState(prev => ({ ...prev, isTracking: true }));
        toast.success('GPS tracking started');
        return true;
      }
    } catch (error) {
      console.error('Failed to start tracking:', error);
      toast.error('Failed to start GPS tracking');
    }
    return false;
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setNavigationState(prev => ({ 
      ...prev, 
      isTracking: false,
      currentPosition: null 
    }));
    toast.info('GPS tracking stopped');
  };

  const updateTrackingAccuracy = (accuracy: 'high' | 'medium' | 'low') => {
    setNavigationState(prev => ({ ...prev, trackingAccuracy: accuracy }));
    
    // Restart tracking with new accuracy if currently tracking
    if (navigationState.isTracking) {
      stopTracking();
      setTimeout(() => startTracking(), 100);
    }
  };

  const getCurrentPosition = (): Promise<GPSPosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gpsPosition: GPSPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            speed: pos.coords.speed || undefined,
            heading: pos.coords.heading || undefined,
            timestamp: pos.timestamp,
          };
          resolve(gpsPosition);
        },
        (error) => {
          console.error('Get position error:', error);
          resolve(null);
        },
        getGeolocationOptions(navigationState.trackingAccuracy)
      );
    });
  };

  const watchPosition = (callback: (position: GPSPosition) => void): number => {
    return navigator.geolocation.watchPosition(
      (pos) => {
        const gpsPosition: GPSPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed || undefined,
          heading: pos.coords.heading || undefined,
          timestamp: pos.timestamp,
        };
        callback(gpsPosition);
      },
      (error) => console.error('Watch position error:', error),
      getGeolocationOptions(navigationState.trackingAccuracy)
    );
  };

  const clearWatch = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  };

  return (
    <NavigationContext.Provider value={{
      navigationState,
      startTracking,
      stopTracking,
      updateTrackingAccuracy,
      getCurrentPosition,
      watchPosition,
      clearWatch,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
