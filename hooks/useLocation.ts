import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { reverseGeocode } from '../lib/location';

export function useLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const request = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude; const lng = loc.coords.longitude;
      setCoords({ lat, lng });
      setAddress(await reverseGeocode(lat, lng));
    }
    setLoading(false);
  };

  return { coords, address, loading, request };
}

