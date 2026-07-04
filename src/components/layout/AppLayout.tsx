import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
