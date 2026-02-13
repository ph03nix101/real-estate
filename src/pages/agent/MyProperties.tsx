import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import propertyService, { Property } from '@/services/property.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreVertical, Pencil, Trash2, Eye, MapPin, Bed, Bath, Square, Building2, PlusCircle, Edit } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function MyProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getMyProperties();
            setProperties(data);
        } catch (error: any) {
            toast({
                title: 'Error loading properties',
                description: error.message || 'Failed to load your properties',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            await propertyService.delete(id);
            toast({
                title: 'Property deleted',
                description: 'The property has been successfully deleted',
            });
            loadProperties();
        } catch (error: any) {
            toast({
                title: 'Error deleting property',
                description: error.message || 'Failed to delete the property',
                variant: 'destructive',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'sold': return 'bg-gray-100 text-gray-800';
            case 'draft': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="h-full">
            {/* Page Header */}
            <div className="bg-white border-b shadow-sm mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center space-x-4">
                    <Building2 className="h-8 w-8 text-real-estate-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                        <p className="text-sm text-gray-600">
                            Manage your property listings
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                        </h2>
                    </div>
                    <Link to="/agent/properties/create">
                        <Button>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Property
                        </Button>
                    </Link>
                </div>

                {/* Properties List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-real-estate-600"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                            <p className="text-gray-600 mb-4 text-center max-w-md">
                                Get started by creating your first property listing
                            </p>
                            <Link to="/agent/properties/create">
                                <Button>
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Your First Property
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Property Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {property.images && property.images.length > 0 ? (
                                        <img
                                            src={propertyService.getImageUrl(property.images[0])}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="h-16 w-16 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge className={getStatusColor(property.status)}>
                                            {property.status}
                                        </Badge>
                                    </div>
                                    {property.featured && (
                                        <div className="absolute top-2 left-2">
                                            <Badge className="bg-yellow-500 text-white">Featured</Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Property Details */}
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                                    <CardDescription className="line-clamp-1">
                                        {property.city}, {property.state}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-lg font-bold text-real-estate-900">
                                                R{property.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>{property.beds} beds</span>
                                            <span>•</span>
                                            <span>{property.baths} baths</span>
                                            <span>•</span>
                                            <div className="flex items-center space-x-1">
                                                <Square className="h-4 w-4" />
                                                <span>{property.sqft} m²</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-2">
                                                <Link to={`/property/${property.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link to={`/agent/properties/edit/${property.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(property.id, property.title)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
