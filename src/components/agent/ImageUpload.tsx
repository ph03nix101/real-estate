import { useState, useRef } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import propertyService from '@/services/property.service';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
    propertyId?: string;
    existingImages?: string[];
    onImagesChange?: (images: string[]) => void;
}

export default function ImageUpload({ propertyId, existingImages = [], onImagesChange }: ImageUploadProps) {
    const [images, setImages] = useState<string[]>(existingImages);
    const [uploading, setUploading] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            if (!isValid) {
                toast({
                    title: 'Invalid file type',
                    description: `${file.name} is not an image file`,
                    variant: 'destructive',
                });
            }
            return isValid;
        });

        // Validate file sizes (5MB max)
        const sizeValidFiles = validFiles.filter(file => {
            const isValid = file.size <= 5 * 1024 * 1024;
            if (!isValid) {
                toast({
                    title: 'File too large',
                    description: `${file.name} exceeds 5MB limit`,
                    variant: 'destructive',
                });
            }
            return isValid;
        });

        if (propertyId) {
            // Property exists - upload immediately
            uploadImages(sizeValidFiles);
        } else {
            // Property doesn't exist yet - store for later
            setPreviewFiles(prev => [...prev, ...sizeValidFiles]);
            onImagesChange?.(images);
        }
    };

    const uploadImages = async (files: File[]) => {
        if (!propertyId) return;

        setUploading(true);
        try {
            const uploadedImages = await propertyService.uploadImages(propertyId, files);
            setImages(uploadedImages);
            onImagesChange?.(uploadedImages);

            toast({
                title: 'Images uploaded',
                description: `Successfully uploaded ${files.length} image(s)`,
            });
        } catch (error: any) {
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload images',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageUrl: string, index: number) => {
        if (propertyId) {
            // Delete from server
            try {
                const updatedImages = await propertyService.deleteImage(propertyId, imageUrl);
                setImages(updatedImages);
                onImagesChange?.(updatedImages);

                toast({
                    title: 'Image deleted',
                    description: 'Image has been removed',
                });
            } catch (error: any) {
                toast({
                    title: 'Delete failed',
                    description: error.message || 'Failed to delete image',
                    variant: 'destructive',
                });
            }
        } else {
            // Remove from preview
            setPreviewFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const getPreviewUrl = (file: File): string => {
        return URL.createObjectURL(file);
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Images
                        </>
                    )}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
            </div>

            {/* Image Grid */}
            {(images.length > 0 || previewFiles.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Existing images from server */}
                    {images.map((imageUrl, index) => (
                        <Card key={imageUrl} className="relative group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="aspect-square relative">
                                    <img
                                        src={propertyService.getImageUrl(imageUrl)}
                                        alt={`Property image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(imageUrl, index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Main Image
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Preview files (not yet uploaded) */}
                    {previewFiles.map((file, index) => (
                        <Card key={index} className="relative group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="aspect-square relative">
                                    <img
                                        src={getPreviewUrl(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover opacity-70"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <ImagePlus className="w-8 h-8 text-white" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete('', index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                                        Not Uploaded
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {images.length === 0 && previewFiles.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ImagePlus className="w-12 h-12 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No images uploaded yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
