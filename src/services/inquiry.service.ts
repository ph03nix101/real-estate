import api from './api';

export interface Inquiry {
    id: string;
    property_id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'new' | 'contacted' | 'scheduled' | 'closed';
    created_at: string;
    updated_at: string;
    // Populated from join with properties
    property_title?: string;
    property_city?: string;
    property_state?: string;
}

export interface InquiryFormData {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export interface InquiryStats {
    total_inquiries: number;
    new_inquiries: number;
    contacted_inquiries: number;
    scheduled_inquiries: number;
    closed_inquiries: number;
}

class InquiryService {
    /**
     * Create a new inquiry (public endpoint)
     */
    async create(data: InquiryFormData): Promise<Inquiry> {
        const response = await api.post('/inquiries', data);
        return response.data.inquiry;
    }

    /**
     * Get all inquiries for the authenticated agent
     */
    async getAll(filters?: { status?: string; propertyId?: string }): Promise<{ inquiries: Inquiry[]; total: number }> {
        const response = await api.get('/inquiries', { params: filters });
        return response.data;
    }

    /**
     * Get inquiry by ID
     */
    async getById(id: string): Promise<Inquiry> {
        const response = await api.get(`/inquiries/${id}`);
        return response.data;
    }

    /**
     * Update inquiry status
     */
    async updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
        const response = await api.put(`/inquiries/${id}/status`, { status });
        return response.data.inquiry;
    }

    /**
     * Delete inquiry
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/inquiries/${id}`);
    }

    /**
     * Get inquiry statistics
     */
    async getStats(): Promise<InquiryStats> {
        const response = await api.get('/inquiries/stats');
        return response.data;
    }
}

export default new InquiryService();
