import api from './api';

export interface Property {
    id: string;
    title: string;
    description?: string;
    location: string;
    city: string;
    state: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    propertyType: 'house' | 'penthouse' | 'villa' | 'estate' | 'loft';
    yearBuilt: number;
    status: 'draft' | 'active' | 'pending' | 'sold';
    featured: boolean;
    images: string[];
    amenities: string[];
    createdAt: string;
    updatedAt: string;
    agent?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
}

export interface PropertyFilters {
    city?: string;
    state?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    status?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
}

export interface PropertyFormData {
    title: string;
    description?: string;
    location: string;
    city: string;
    state: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    propertyType: 'house' | 'penthouse' | 'villa' | 'estate' | 'loft';
    yearBuilt: number;
    status?: 'draft' | 'active' | 'pending' | 'sold';
    featured?: boolean;
    amenities?: string[];
}

export interface PropertiesResponse {
    properties: Property[];
    count: number;
    limit: number;
    offset: number;
}

export interface PropertyResponse {
    property: Property;
}

export interface ImageUploadResponse {
    message: string;
    images: string[];
    uploadedCount: number;
}

class PropertyService {
    /**
     * Get all properties with optional filters
     */
    async getAll(filters?: PropertyFilters): Promise<PropertiesResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<PropertiesResponse>(`/properties?${params.toString()}`);
        return response.data;
    }

    /**
     * Get property by ID
     */
    async getById(id: string): Promise<Property> {
        const response = await api.get<PropertyResponse>(`/properties/${id}`);
        return response.data.property;
    }

    /**
     * Create new property
     */
    async create(data: PropertyFormData): Promise<Property> {
        const response = await api.post<{ message: string; property: Property }>('/properties', data);
        return response.data.property;
    }

    /**
     * Update property
     */
    async update(id: string, data: Partial<PropertyFormData>): Promise<Property> {
        const response = await api.put<{ message: string; property: Property }>(`/properties/${id}`, data);
        return response.data.property;
    }

    /**
     * Delete property
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/properties/${id}`);
    }

    /**
     * Get agent's properties
     */
    async getMyProperties(): Promise<Property[]> {
        const response = await api.get<{ properties: Property[]; count: number }>('/properties/agent/my-properties');
        return response.data.properties;
    }

    /**
     * Upload images for a property
     */
    async uploadImages(propertyId: string, files: File[]): Promise<string[]> {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post<ImageUploadResponse>(
            `/properties/${propertyId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.images;
    }

    /**
     * Delete an image from a property
     */
    async deleteImage(propertyId: string, imageUrl: string): Promise<string[]> {
        const response = await api.delete<{ message: string; images: string[] }>(
            `/properties/${propertyId}/images`,
            {
                data: { imageUrl },
            }
        );

        return response.data.images;
    }

    /**
     * Get full image URL
     */
    getImageUrl(imagePath: string): string {
        // Remove /api from the URL since static files are served from root
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const baseUrl = apiUrl.replace('/api', '');
        return `${baseUrl}${imagePath}`;
    }
}

export default new PropertyService();
