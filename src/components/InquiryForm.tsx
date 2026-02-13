import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import inquiryService from '@/services/inquiry.service';

const inquirySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(50).optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
    propertyId: string;
    propertyTitle: string;
}

const InquiryForm = ({ propertyId, propertyTitle }: InquiryFormProps) => {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InquiryFormData>({
        resolver: zodResolver(inquirySchema),
    });

    const onSubmit = async (data: InquiryFormData) => {
        try {
            setSubmitting(true);
            await inquiryService.create({
                propertyId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
            });

            toast({
                title: 'Inquiry sent!',
                description: 'Thank you for your interest. The agent will contact you soon.',
            });

            reset();
        } catch (error: any) {
            toast({
                title: 'Error sending inquiry',
                description: error.message || 'Failed to submit inquiry. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    {...register('name')}
                    placeholder="Your Name"
                    className="bg-background"
                    disabled={submitting}
                />
                {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email Address"
                    className="bg-background"
                    disabled={submitting}
                />
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="bg-background"
                    disabled={submitting}
                />
                {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
            </div>

            <div>
                <Textarea
                    {...register('message')}
                    placeholder={`I'm interested in ${propertyTitle}...`}
                    rows={4}
                    className="bg-background resize-none"
                    disabled={submitting}
                />
                {errors.message && (
                    <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                )}
            </div>

            <Button
                type="submit"
                variant="luxury"
                className="w-full"
                disabled={submitting}
            >
                {submitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Inquiry
                    </>
                )}
            </Button>
        </form>
    );
};

export default InquiryForm;
