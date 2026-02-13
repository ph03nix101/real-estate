import { APIProvider } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

interface GoogleMapsProviderProps {
    children: ReactNode;
}

const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
        return <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            Google Maps API key is missing. Please configure your environment variables.
        </div>;
    }

    return (
        <APIProvider apiKey={apiKey}>
            {children}
        </APIProvider>
    );
};

export default GoogleMapsProvider;
