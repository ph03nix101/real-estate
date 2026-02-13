import api from './api';

export interface Appointment {
    id: string;
    property_id: string;
    inquiry_id?: string;
    name: string;
    email: string;
    phone?: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string; // Added to match interface
    property_title?: string;
    property_location?: string;
    property_images?: any;
    agent_id?: string; // Added if returned
}

export interface CreateAppointmentDTO {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
}

export interface AppointmentStats {
    total_appointments: string;
    pending_appointments: string;
    confirmed_appointments: string;
    cancelled_appointments: string;
    completed_appointments: string;
    upcoming_appointments: string;
}

const appointmentService = {
    // Create a new appointment
    create: async (data: CreateAppointmentDTO) => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    // Get all appointments for the logged-in agent
    getAll: async (params?: { status?: string; propertyId?: string }) => {
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    // Get specific appointment by ID
    getById: async (id: string) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    // Update appointment status
    updateStatus: async (id: string, status: string) => {
        const response = await api.put(`/appointments/${id}/status`, { status });
        return response.data;
    },

    // Delete an appointment
    delete: async (id: string) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },

    // Get appointment statistics
    getStats: async () => {
        const response = await api.get('/appointments/stats');
        return response.data;
    }
};

export default appointmentService;
