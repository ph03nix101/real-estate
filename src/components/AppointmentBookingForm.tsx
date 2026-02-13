import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import appointmentService from '@/services/appointment.service';

// Validation schema
const appointmentSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(50).optional(),
    preferred_date: z.date({
        required_error: "Please select a date",
    }),
    preferred_time: z.string({
        required_error: "Please select a time",
    }).regex(/^\d{2}:\d{2}$/, 'Please select a valid time'),
    message: z.string().max(2000).optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentBookingFormProps {
    propertyId: string;
    propertyTitle: string;
}

const AppointmentBookingForm = ({ propertyId, propertyTitle }: AppointmentBookingFormProps) => {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const form = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = form;

    const date = watch("preferred_date");
    const time = watch("preferred_time");

    // Generate time slots (9:00 AM to 5:00 PM)
    const timeSlots = [];
    for (let i = 9; i <= 17; i++) {
        timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
        if (i !== 17) {
            timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
        }
    }

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            setSubmitting(true);

            // Validate date is in the future
            const selectedDate = data.preferred_date;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                toast({
                    title: 'Invalid date',
                    description: 'Please select a future date for the appointment.',
                    variant: 'destructive',
                });
                return;
            }

            // Format date to YYYY-MM-DD for backend
            const formattedDate = format(selectedDate, "yyyy-MM-dd");

            await appointmentService.create({
                propertyId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                preferred_date: formattedDate,
                preferred_time: data.preferred_time,
                message: data.message,
            });

            toast({
                title: 'Appointment requested!',
                description: 'Your appointment request has been sent. The agent will confirm shortly.',
            });

            reset();
            // Reset controlled fields manually since reset() handles registered inputs best
            setValue("preferred_date", undefined as any);
            setValue("preferred_time", "");

        } catch (error: any) {
            toast({
                title: 'Error booking appointment',
                description: error.message || 'Failed to submit appointment request. Please try again.',
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal bg-background hover:bg-background/90",
                                    !date && "text-muted-foreground",
                                    errors.preferred_date && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={submitting}
                            >
                                {date ? (
                                    format(date, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setValue("preferred_date", d as Date, { shouldValidate: true });
                                    setIsCalendarOpen(false);
                                }}
                                disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.preferred_date && (
                        <p className="text-sm text-red-500">{errors.preferred_date.message}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Select
                        onValueChange={(v) => setValue("preferred_time", v, { shouldValidate: true })}
                        value={time}
                        disabled={submitting}
                    >
                        <SelectTrigger className={cn(
                            "w-full bg-background",
                            !time && "text-muted-foreground",
                            errors.preferred_time && "border-red-500 ring-red-500"
                        )}>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 opacity-50" />
                                <SelectValue placeholder="Select time" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                    {slot}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.preferred_time && (
                        <p className="text-sm text-red-500">{errors.preferred_time.message}</p>
                    )}
                </div>
            </div>

            <div>
                <Textarea
                    {...register('message')}
                    placeholder={`Optional message about viewing ${propertyTitle}...`}
                    rows={3}
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
                        Booking...
                    </>
                ) : (
                    <>
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Request Appointment
                    </>
                )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
                Available viewing times: 9:00 AM - 5:00 PM
            </p>
        </form>
    );
};

export default AppointmentBookingForm;
