import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuthStore } from "../../stores/auth.store";

export default function DashboardLayout({ children }) {
  const user = useAuthStore((state) => state.user);
  const showSidebar = user && user.role === 'owner';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={showSidebar ? "md:pl-64 flex flex-col flex-1" : "flex flex-col flex-1"}>
        <Topbar />
        <main className="flex-1">
          <div className="py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
