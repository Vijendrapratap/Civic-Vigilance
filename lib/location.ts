import * as Location from 'expo-location';

export async function requestLocation(): Promise<Location.LocationObject | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  return await Location.getCurrentPositionAsync({});
}

export async function reverseGeocode(lat: number, lng: number) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    const r = results[0];
    if (!r) return '';
    return `${r.name ?? ''} ${r.street ?? ''}, ${r.city ?? ''}, ${r.region ?? ''} ${r.postalCode ?? ''}`.trim();
  } catch {
    return '';
  }
}

