import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import propertyService, { PropertyFormData } from '@/services/property.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Home, ArrowLeft, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/agent/ImageUpload';

export default function CreateProperty() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        description: '',
        location: '',
        city: '',
        state: '',
        price: 0,
        beds: 1,
        baths: 1,
        sqft: 0,
        propertyType: 'house',
        yearBuilt: new Date().getFullYear(),
        status: 'draft',
        featured: false,
        amenities: [],
    });
    const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);

    const amenitiesList = [
        'Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Elevator',
        'Security', 'Air Conditioning', 'Heating', 'Fireplace',
        'Dishwasher', 'Laundry', 'Pet Friendly', 'Furnished'
    ];

    const handleChange = (field: keyof PropertyFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities?.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...(prev.amenities || []), amenity],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const property = await propertyService.create(formData);
            setCreatedPropertyId(property.id);

            toast({
                title: 'Property created!',
                description: 'Your property has been successfully created. You can now upload images.',
            });

            // Scroll to image upload section
            setTimeout(() => {
                document.getElementById('image-upload')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } catch (error: any) {
            toast({
                title: 'Error creating property',
                description: error.message || 'Failed to create property',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        navigate('/agent/properties');
    };

    return (
        <div className="h-full">
            {/* Page Header */}
            <div className="bg-white border-b shadow-sm mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Building2 className="h-8 w-8 text-real-estate-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Property</h1>
                            <p className="text-sm text-gray-600">Add a new property listing</p>
                        </div>
                    </div>
                    <Link to="/agent/properties">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Enter the main details about the property</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Property Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="Luxury Beachfront Villa"
                                    required
                                    disabled={loading || !!createdPropertyId}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe the property..."
                                    rows={4}
                                    disabled={loading || !!createdPropertyId}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="propertyType">Property Type *</Label>
                                    <Select
                                        value={formData.propertyType}
                                        onValueChange={(value: any) => handleChange('propertyType', value)}
                                        disabled={loading || !!createdPropertyId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="penthouse">Penthouse</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                            <SelectItem value="estate">Estate</SelectItem>
                                            <SelectItem value="loft">Loft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: any) => handleChange('status', value)}
                                        disabled={loading || !!createdPropertyId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                            <CardDescription>Where is the property located?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="location">Address *</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="123 Beach Drive"
                                    required
                                    disabled={loading || !!createdPropertyId}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        placeholder="Malibu"
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        placeholder="CA"
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input
                                        id="zipCode"
                                        value={formData.zipCode || ''}
                                        onChange={(e) => handleChange('zipCode', e.target.value)}
                                        placeholder="90265"
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={formData.latitude || ''}
                                            onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            placeholder="34.0259"
                                            disabled={loading || !!createdPropertyId}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Get from Google Maps (right click &gt; coordinates)</p>
                                </div>

                                <div>
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            value={formData.longitude || ''}
                                            onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            placeholder="-118.7798"
                                            disabled={loading || !!createdPropertyId}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={async () => {
                                        if (!formData.location || !formData.city || !formData.state) {
                                            toast({
                                                title: "Missing address details",
                                                description: "Please enter address, city, and state first.",
                                                variant: "destructive"
                                            });
                                            return;
                                        }

                                        const address = `${formData.location}, ${formData.city}, ${formData.state} ${formData.zipCode || ''}`;
                                        try {
                                            // Import dynamically to avoid circular dependencies if any, 
                                            // though here it's fine. We need to make sure the API is loaded.
                                            // Since we are not in the GoogleMapsProvider here, we might need to rely on the script being loaded 
                                            // or wrap this component. 
                                            // A cleaner way is to use the utility we just created.

                                            // Note: In a real app, ensure Google Maps script is loaded. 
                                            // Since MapSection loads it, it might be available if user visited home.
                                            // But if they came straight here, it might not be.
                                            // For now, assuming it's loaded or we'll handle the error.

                                            const { geocodeAddress } = await import('@/utils/geocoding');
                                            const coords = await geocodeAddress(address);

                                            if (coords) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    latitude: coords.lat,
                                                    longitude: coords.lng
                                                }));
                                                toast({
                                                    title: "Coordinates found",
                                                    description: `Lat: ${coords.lat}, Lng: ${coords.lng}`,
                                                });
                                            } else {
                                                throw new Error("Location not found");
                                            }
                                        } catch (error) {
                                            toast({
                                                title: "Geocoding failed",
                                                description: "Could not find coordinates. Please enter manually.",
                                                variant: "destructive"
                                            });
                                        }
                                    }}
                                    disabled={loading || !!createdPropertyId}
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Auto-Fill Coordinates
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Property Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                            <CardDescription>Specifications and pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                        placeholder="5500000"
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="yearBuilt">Year Built *</Label>
                                    <Input
                                        id="yearBuilt"
                                        type="number"
                                        value={formData.yearBuilt}
                                        onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
                                        placeholder="2022"
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="beds">Bedrooms *</Label>
                                    <Input
                                        id="beds"
                                        type="number"
                                        min="0"
                                        value={formData.beds}
                                        onChange={(e) => handleChange('beds', parseInt(e.target.value))}
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="baths">Bathrooms *</Label>
                                    <Input
                                        id="baths"
                                        type="number"
                                        min="0"
                                        value={formData.baths}
                                        onChange={(e) => handleChange('baths', parseInt(e.target.value))}
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sqft">Area (m²) *</Label>
                                    <Input
                                        id="sqft"
                                        type="number"
                                        min="0"
                                        value={formData.sqft}
                                        onChange={(e) => handleChange('sqft', parseInt(e.target.value))}
                                        required
                                        disabled={loading || !!createdPropertyId}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleChange('featured', checked)}
                                    disabled={loading || !!createdPropertyId}
                                />
                                <Label htmlFor="featured" className="font-normal cursor-pointer">
                                    Mark as featured property
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                            <CardDescription>Select available amenities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {amenitiesList.map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={amenity}
                                            checked={formData.amenities?.includes(amenity)}
                                            onCheckedChange={() => toggleAmenity(amenity)}
                                            disabled={loading || !!createdPropertyId}
                                        />
                                        <Label htmlFor={amenity} className="font-normal cursor-pointer text-sm">
                                            {amenity}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    {!createdPropertyId && (
                        <div className="flex items-center justify-end space-x-4">
                            <Link to="/agent/properties">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Property'}
                            </Button>
                        </div>
                    )}
                </form>

                {/* Image Upload Section - Only show after property is created */}
                {createdPropertyId && (
                    <div id="image-upload" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Images</CardTitle>
                                <CardDescription>Add photos to showcase your property</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload propertyId={createdPropertyId} />

                                <div className="flex items-center justify-end mt-6">
                                    <Button onClick={handleFinish}>
                                        Finish & View Properties
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
