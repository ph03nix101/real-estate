import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import propertyService, { Property, PropertyFormData } from '@/services/property.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/agent/ImageUpload';

export default function EditProperty() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [property, setProperty] = useState<Property | null>(null);
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

    const amenitiesList = [
        'Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Elevator',
        'Security', 'Air Conditioning', 'Heating', 'Fireplace',
        'Dishwasher', 'Laundry', 'Pet Friendly', 'Furnished'
    ];

    useEffect(() => {
        if (id) {
            loadProperty();
        }
    }, [id]);

    const loadProperty = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await propertyService.getById(id);
            setProperty(data);

            // Populate form with existing data
            setFormData({
                title: data.title,
                description: data.description || '',
                location: data.location,
                city: data.city,
                state: data.state,
                price: data.price,
                beds: data.beds,
                baths: data.baths,
                sqft: data.sqft,
                propertyType: data.propertyType,
                yearBuilt: data.yearBuilt,
                status: data.status,
                featured: data.featured,
                amenities: data.amenities || [],
            });
        } catch (error: any) {
            toast({
                title: 'Error loading property',
                description: error.message || 'Failed to load property',
                variant: 'destructive',
            });
            navigate('/agent/properties');
        } finally {
            setLoading(false);
        }
    };

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
        if (!id) return;

        setSaving(true);
        try {
            await propertyService.update(id, formData);

            toast({
                title: 'Property updated!',
                description: 'Your property has been successfully updated.',
            });

            navigate('/agent/properties');
        } catch (error: any) {
            toast({
                title: 'Error updating property',
                description: error.message || 'Failed to update property',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-real-estate-600" />
            </div>
        );
    }

    if (!property) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-real-estate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Building2 className="h-8 w-8 text-real-estate-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
                                <p className="text-sm text-gray-600">Update property details</p>
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
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Edit the main details about the property</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Property Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    disabled={saving}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="propertyType">Property Type *</Label>
                                    <Select
                                        value={formData.propertyType}
                                        onValueChange={(value: any) => handleChange('propertyType', value)}
                                        disabled={saving}
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
                                        disabled={saving}
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
                            <CardDescription>Property location details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="location">Address *</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        required
                                        disabled={saving}
                                    />
                                </div>
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
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="yearBuilt">Year Built *</Label>
                                    <Input
                                        id="yearBuilt"
                                        type="number"
                                        value={formData.yearBuilt}
                                        onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
                                        required
                                        disabled={saving}
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
                                        disabled={saving}
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
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sqft">Square Feet *</Label>
                                    <Input
                                        id="sqft"
                                        type="number"
                                        min="0"
                                        value={formData.sqft}
                                        onChange={(e) => handleChange('sqft', parseInt(e.target.value))}
                                        required
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleChange('featured', checked)}
                                    disabled={saving}
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
                                            disabled={saving}
                                        />
                                        <Label htmlFor={amenity} className="font-normal cursor-pointer text-sm">
                                            {amenity}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Images</CardTitle>
                            <CardDescription>Manage property photos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                propertyId={id}
                                existingImages={property.images}
                                onImagesChange={(images) => {
                                    // Update local property state if needed
                                    setProperty(prev => prev ? { ...prev, images } : null);
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link to="/agent/properties">
                            <Button type="button" variant="outline" disabled={saving}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
