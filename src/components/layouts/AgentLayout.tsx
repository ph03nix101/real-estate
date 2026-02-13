import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { AgentSidebar } from "./AgentSidebar";

const AgentLayout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 pt-20 container text-container max-w-7xl mx-auto flex gap-8">
                <AgentSidebar />
                <main className="flex-1 pb-8 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


export default AgentLayout;
