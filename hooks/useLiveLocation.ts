import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { reverseGeocode } from '../lib/location';

export function useLiveLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [address, setAddress] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | 'unavailable'>('unavailable');
  const [hasInitialAddress, setHasInitialAddress] = useState(false);
  const lastGeocodeCoords = useRef<{ lat: number; lng: number } | null>(null);
  const watchSub = useRef<Location.LocationSubscription | null>(null);

  // Helper to calculate distance in meters (Haversine formula)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== 'granted') return;
      watchSub.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 }, async (loc) => {
        const c = { lat: loc.coords.latitude, lng: loc.coords.longitude, accuracy: loc.coords.accuracy ?? undefined };
        setCoords(c);

        // Only reverse geocode if first time OR moved more than 25 meters to avoid spamming the API
        const last = lastGeocodeCoords.current;
        if (!hasInitialAddress || !last || getDistance(last.lat, last.lng, c.lat, c.lng) > 25) {
          lastGeocodeCoords.current = c;
          const reverseRes = await reverseGeocode(c.lat, c.lng);
          setAddress(reverseRes);
          if (!hasInitialAddress) setHasInitialAddress(true);
        }
      });
    })();
    return () => { watchSub.current?.remove(); };
  }, [hasInitialAddress]);

  return { coords, address, accuracy: coords?.accuracy, permissionStatus };
}

