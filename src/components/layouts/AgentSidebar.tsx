import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Building2,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/agent/dashboard' },
    { icon: Building2, label: 'My Properties', href: '/agent/properties' },
    { icon: MessageSquare, label: 'Inquiries', href: '/agent/inquiries' },
    { icon: Calendar, label: 'Appointments', href: '/agent/appointments' },
];

export function AgentSidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="hidden lg:flex h-full w-64 flex-col border-r bg-card">
            <div className="flex-1 py-6 px-4 space-y-4">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start",
                                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent/50"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t space-y-2">
                {/* Settings could go here */}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
