import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { reverseGeocode } from '../lib/location';

export function useLiveLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [address, setAddress] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | 'unavailable'>('unavailable');
  const watchSub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== 'granted') return;
      watchSub.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 }, async (loc) => {
        const c = { lat: loc.coords.latitude, lng: loc.coords.longitude, accuracy: loc.coords.accuracy ?? undefined };
        setCoords(c);
        // Only reverse geocode occasionally to avoid spam
        setAddress(await reverseGeocode(c.lat, c.lng));
      });
    })();
    return () => { watchSub.current?.remove(); };
  }, []);

  return { coords, address, accuracy: coords?.accuracy, permissionStatus };
}

