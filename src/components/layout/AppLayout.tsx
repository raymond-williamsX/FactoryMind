import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSidebar } from "@/context/SidebarContext";

export default function AppLayout() {
  const { isMobile } = useSidebar();

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Panel — on mobile it renders as a fixed overlay drawer */}
      <Sidebar />

      {/* Main View Area — takes full width on mobile since sidebar is overlay */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative ${isMobile ? "w-full" : ""}`}>
        <TopBar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
