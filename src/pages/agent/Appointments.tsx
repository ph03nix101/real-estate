import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    MapPin,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock3,
    MoreVertical,
    Trash2,
    MessageSquare,
    User,
    Mail,
    Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import appointmentService, { Appointment } from '@/services/appointment.service';

const Appointments = () => {
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getAll();
            // Ensure we get an array
            const appointmentList = Array.isArray(data) ? data : (data as any).appointments || [];
            setAppointments(appointmentList);
        } catch (error) {
            console.error('Failed to load appointments:', error);
            toast({
                title: 'Error',
                description: 'Failed to load appointments',
                variant: 'destructive',
            });
            setAppointments([]); // Fallback to empty array
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await appointmentService.updateStatus(id, newStatus);
            toast({
                title: 'Status updated',
                description: `Appointment marked as ${newStatus}`,
            });
            loadAppointments();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update status',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            await appointmentService.delete(id);
            toast({
                title: 'Deleted',
                description: 'Appointment removed successfully',
            });
            loadAppointments();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete appointment',
                variant: 'destructive',
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
            case 'completed':
                return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch =
            apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (apt.property_title && apt.property_title.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-full">
            {/* Header */}
            <div className="bg-white border-b shadow-sm mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">Appointments</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your property viewings and schedule
                        </p>
                    </div>
                    <Link to="/agent/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search client, property..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            {loading ? (
                <div className="text-center py-12">Loading appointments...</div>
            ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No appointments found</h3>
                    <p className="text-muted-foreground">No appointments match your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredAppointments.map((apt) => (
                        <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Date/Time Column */}
                                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-32 md:border-r border-border/50 md:pr-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-2xl font-bold text-foreground">
                                            {format(new Date(apt.preferred_date), 'dd')}
                                        </p>
                                        <p className="text-sm font-medium text-muted-foreground uppercase">
                                            {format(new Date(apt.preferred_date), 'MMM')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium bg-muted px-2 py-1 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(`2000-01-01T${apt.preferred_time}`), 'h:mm a')}
                                    </div>
                                </div>

                                {/* Main Info Column */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(apt.status)}
                                            <h3 className="font-semibold text-lg text-foreground">
                                                {apt.property_title || 'Unknown Property'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {apt.property_location || 'Location N/A'}
                                        </div>
                                    </div>

                                    {/* Client Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{apt.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <a href={`mailto:${apt.email}`} className="hover:text-gold">{apt.email}</a>
                                        </div>
                                        {apt.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <a href={`tel:${apt.phone}`} className="hover:text-gold">{apt.phone}</a>
                                            </div>
                                        )}
                                    </div>

                                    {apt.message && (
                                        <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground italic flex gap-2">
                                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            "{apt.message}"
                                        </div>
                                    )}
                                </div>

                                {/* Actions Column */}
                                <div className="flex md:flex-col justify-end gap-2 md:pl-6 md:border-l border-border/50">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'confirmed')}>
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Confirm
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'completed')}>
                                                <Clock3 className="w-4 h-4 mr-2 text-blue-500" /> Complete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'cancelled')}>
                                                <XCircle className="w-4 h-4 mr-2 text-red-500" /> Cancel
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(apt.id)} className="text-red-500">
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Quick Actions for Pending */}
                                    {apt.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="hidden md:flex bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 border-green-200"
                                            onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                        >
                                            Confirm
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;
