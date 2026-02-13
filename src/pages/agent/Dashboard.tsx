import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, PlusCircle, ListFilter, LogOut, Home, MessageSquare, Loader2, Calendar } from 'lucide-react';
import inquiryService, { InquiryStats } from '@/services/inquiry.service';
import appointmentService, { AppointmentStats } from '@/services/appointment.service';
import { useToast } from '@/hooks/use-toast';

export default function AgentDashboard() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [inquiryStats, setInquiryStats] = useState<InquiryStats | null>(null);
    const [appointmentStats, setAppointmentStats] = useState<AppointmentStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [inqStats, aptStats] = await Promise.all([
                inquiryService.getStats(),
                appointmentService.getStats()
            ]);
            setInquiryStats(inqStats);
            setAppointmentStats(aptStats);
        } catch (error: any) {
            console.error('Failed to load stats:', error);
            // Don't show error toast for stats, just log it
        } finally {
            setLoadingStats(false);
        }
    };

    return (
        <div className="h-full">
            {/* Page Header */}
            <div className="bg-white border-b shadow-sm mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center space-x-4">
                    <Building2 className="h-8 w-8 text-real-estate-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                        <p className="text-sm text-gray-600">
                            Welcome back, {user?.firstName} {user?.lastName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link to="/agent/inquiries">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Inquiries</CardTitle>
                                    <MessageSquare className="h-6 w-6 text-real-estate-600" />
                                </div>
                                <CardDescription>Manage customer inquiries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-real-estate-600" />
                                    </div>
                                ) : inquiryStats ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">New:</span>
                                            <span className="font-semibold text-blue-600">{inquiryStats.new_inquiries}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total:</span>
                                            <span className="font-semibold">{inquiryStats.total_inquiries}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-2 text-sm text-muted-foreground">No data available</div>
                                )}
                                <Button className="w-full mt-2" variant="outline" size="sm">
                                    View Inquiries
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link to="/agent/appointments">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Appointments</CardTitle>
                                    <Calendar className="h-6 w-6 text-real-estate-600" />
                                </div>
                                <CardDescription>Manage viewings & meetings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-real-estate-600" />
                                    </div>
                                ) : appointmentStats ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Pending:</span>
                                            <span className="font-semibold text-orange-600">{appointmentStats.pending_appointments}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Upcoming:</span>
                                            <span className="font-semibold text-green-600">{appointmentStats.upcoming_appointments}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-2 text-sm text-muted-foreground">No data available</div>
                                )}
                                <Button className="w-full mt-2" variant="outline" size="sm">
                                    View Calendar
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                </div>

                {/* Stats Overview */}
                {!loadingStats && inquiryStats && inquiryStats.total_inquiries > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Inquiry Overview</CardTitle>
                            <CardDescription>Summary of your property inquiries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{inquiryStats.new_inquiries}</div>
                                    <div className="text-sm text-gray-600">New</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{inquiryStats.contacted_inquiries}</div>
                                    <div className="text-sm text-gray-600">Contacted</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{inquiryStats.scheduled_inquiries}</div>
                                    <div className="text-sm text-gray-600">Scheduled</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{inquiryStats.closed_inquiries}</div>
                                    <div className="text-sm text-gray-600">Closed</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Profile Card */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
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
                                    <span className="font-medium">Manage Inquiries & Appointments</span> - Respond to leads and schedule viewings using the dashboard tools
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
