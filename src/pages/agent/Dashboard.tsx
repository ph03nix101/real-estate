import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, PlusCircle, ListFilter, LogOut, Home } from 'lucide-react';

export default function AgentDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-real-estate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Building2 className="h-8 w-8 text-real-estate-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                                <p className="text-sm text-gray-600">
                                    Welcome back, {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link to="/">
                                <Button variant="outline" size="sm">
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link to="/agent/properties/create">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Create Property</CardTitle>
                                    <PlusCircle className="h-6 w-6 text-real-estate-600" />
                                </div>
                                <CardDescription>Add a new property listing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" size="sm">
                                    Create New Listing
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link to="/agent/properties">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">My Properties</CardTitle>
                                    <ListFilter className="h-6 w-6 text-real-estate-600" />
                                </div>
                                <CardDescription>Manage your property listings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="outline" size="sm">
                                    View All Properties
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Profile</CardTitle>
                                <Building2 className="h-6 w-6 text-real-estate-600" />
                            </div>
                            <CardDescription>Manage your account settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Email:</span> {user?.email}</p>
                                <p><span className="font-medium">Role:</span> {user?.role}</p>
                                {user?.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Getting Started Guide */}
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>Quick steps to manage your properties</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-3 text-sm">
                            <li className="text-gray-700">
                                <span className="font-medium">Create your first property</span> - Click "Create Property" to add a new listing with details and photos
                            </li>
                            <li className="text-gray-700">
                                <span className="font-medium">Upload images</span> - Add high-quality photos to showcase your property
                            </li>
                            <li className="text-gray-700">
                                <span className="font-medium">Set status</span> - Update property status (draft, active, pending, sold)
                            </li>
                            <li className="text-gray-700">
                                <span className="font-medium">Manage inquiries</span> - Respond to potential buyers (coming soon)
                            </li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
