/**
 * Geocodes an address using the Google Maps Geocoding API.
 * 
 * @param address - The address string to geocode (e.g. "123 Main St, City, State, Zip")
 * @returns Promise resolving to an object with lat and lng, or null if not found.
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            console.error('Google Maps JavaScript API not loaded or Geocoder library missing.');
            return null;
        }

        const geocoder = new window.google.maps.Geocoder();

        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });

        if (result.length > 0) {
            const location = result[0].geometry.location;
            return {
                lat: location.lat(),
                lng: location.lng()
            };
        }

        return null;
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
};
