import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { Property } from '@/services/property.service';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Ruler } from 'lucide-react';

interface PropertyMapProps {
    properties: Property[];
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
}

const PropertyMap = ({ properties, center, zoom = 4, className = '' }: PropertyMapProps) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    // Filter properties that have coordinates
    const validProperties = properties.filter(p => p.latitude && p.longitude);

    // Calculate center if not provided
    const defaultCenter = center || (validProperties.length > 0
        ? {
            lat: validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length,
            lng: validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length,
        }
        : { lat: 39.8283, lng: -98.5795 } // Center of USA
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPropertyImage = (property: Property) => {
        if (property.images && property.images.length > 0) {
            const firstImage = property.images[0];
            if (firstImage.startsWith('http')) {
                return firstImage;
            }
            return `${firstImage}`;
        }
        return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6';
    };

    return (
        <Map
            mapId="luxury-real-estate-map"
            defaultCenter={defaultCenter}
            defaultZoom={zoom}
            className={className}
            gestureHandling="greedy"
            disableDefaultUI={false}
            styles={[
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#C5E3EA' }],
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [{ color: '#F5F5F0' }],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }],
                },
                {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'transit',
                    stylers: [{ visibility: 'simplified' }],
                },
                {
                    featureType: 'administrative',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#2C2C2C' }],
                },
            ]}
        >
            {validProperties.map((property) => (
                <AdvancedMarker
                    key={property.id}
                    position={{ lat: property.latitude!, lng: property.longitude! }}
                    onClick={() => setSelectedProperty(property)}
                >
                    <div className="relative">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer
                ${selectedProperty?.id === property.id
                                    ? 'bg-gold scale-125 ring-4 ring-gold/30'
                                    : 'bg-gold/80 hover:bg-gold hover:scale-110'
                                }`}
                        >
                            <MapPin className="w-5 h-5 text-charcoal" />
                        </div>
                    </div>
                </AdvancedMarker>
            ))}

            {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
                <InfoWindow
                    position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
                    onCloseClick={() => setSelectedProperty(null)}
                    headerContent={null}
                >
                    <div className="p-2 min-w-[220px]">
                        <img
                            src={getPropertyImage(selectedProperty)}
                            alt={selectedProperty.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-semibold text-sm text-foreground truncate">
                            {selectedProperty.title}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {selectedProperty.city}, {selectedProperty.state}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-bold text-gold">
                                R{selectedProperty.price.toLocaleString()}
                            </p>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Ruler className="w-3 h-3" />
                                {selectedProperty.sqft.toLocaleString()} m²
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />
                                {selectedProperty.beds}
                            </span>
                            <span className="flex items-center gap-1">
                                <Bath className="w-3 h-3" />
                                {selectedProperty.baths}
                            </span>
                            <span className="flex items-center gap-1">
                                <Ruler className="w-3 h-3" />
                                {selectedProperty.sqft.toLocaleString()}
                            </span>
                        </div>
                        <Link
                            to={`/property/${selectedProperty.id}`}
                            className="block mt-2 text-center text-xs font-semibold text-charcoal bg-gold hover:bg-gold-light rounded-lg py-1.5 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </InfoWindow>
            )}
        </Map>
    );
};

export default PropertyMap;
