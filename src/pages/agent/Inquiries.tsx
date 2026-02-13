import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, Trash2, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import inquiryService, { Inquiry } from '@/services/inquiry.service';

const statusConfig = {
    new: { label: 'New', icon: MessageSquare, color: 'bg-blue-500' },
    contacted: { label: 'Contacted', icon: Phone, color: 'bg-yellow-500' },
    scheduled: { label: 'Scheduled', icon: Clock, color: 'bg-purple-500' },
    closed: { label: 'Closed', icon: CheckCircle2, color: 'bg-green-500' },
};

const Inquiries = () => {
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadInquiries();
    }, [statusFilter]);

    const loadInquiries = async () => {
        try {
            setLoading(true);
            const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
            const response = await inquiryService.getAll(filters);
            setInquiries(response.inquiries);
        } catch (error: any) {
            toast({
                title: 'Error loading inquiries',
                description: error.message || 'Failed to load inquiries',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: Inquiry['status']) => {
        try {
            await inquiryService.updateStatus(id, status);
            toast({
                title: 'Status updated',
                description: 'Inquiry status has been updated successfully',
            });
            loadInquiries();
        } catch (error: any) {
            toast({
                title: 'Error updating status',
                description: error.message || 'Failed to update inquiry status',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            await inquiryService.delete(id);
            toast({
                title: 'Inquiry deleted',
                description: 'Inquiry has been deleted successfully',
            });
            loadInquiries();
        } catch (error: any) {
            toast({
                title: 'Error deleting inquiry',
                description: error.message || 'Failed to delete inquiry',
                variant: 'destructive',
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="bg-white border-b shadow-sm mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">Inquiries</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage inquiries for your properties
                        </p>
                    </div>
                    <Link to="/agent/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Inquiries</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                        {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
                    </span>
                </div>
            </div>

            {/* Inquiries List */}
            <div className="pb-20">
                {inquiries.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No inquiries yet
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                {statusFilter !== 'all'
                                    ? `No inquiries with status "${statusFilter}"`
                                    : 'When people inquire about your properties, they will appear here.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inquiry, index) => {
                            const StatusIcon = statusConfig[inquiry.status].icon;
                            return (
                                <motion.div
                                    key={inquiry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`${statusConfig[inquiry.status].color} text-white`}
                                                        >
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {statusConfig[inquiry.status].label}
                                                        </Badge>
                                                    </div>
                                                    <CardDescription>
                                                        Property: {inquiry.property_title} •{' '}
                                                        {inquiry.property_city}, {inquiry.property_state}
                                                    </CardDescription>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatDate(inquiry.created_at)}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Contact Info */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gold" />
                                                    <a
                                                        href={`mailto:${inquiry.email}`}
                                                        className="text-foreground hover:text-gold transition-colors"
                                                    >
                                                        {inquiry.email}
                                                    </a>
                                                </div>
                                                {inquiry.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gold" />
                                                        <a
                                                            href={`tel:${inquiry.phone}`}
                                                            className="text-foreground hover:text-gold transition-colors"
                                                        >
                                                            {inquiry.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Message */}
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                                    {inquiry.message}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 pt-2">
                                                <Select
                                                    value={inquiry.status}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(inquiry.id, value as Inquiry['status'])
                                                    }
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="contacted">Contacted</SelectItem>
                                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(inquiry.id)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inquiries;
