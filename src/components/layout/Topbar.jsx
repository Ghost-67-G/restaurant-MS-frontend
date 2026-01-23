import { Menu, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import { useLogout } from "../../hooks/useAuth";
import { Button } from "../ui/button";

export default function Topbar() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-slate-200">
      <button
        type="button"
        className="px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex flex-1 justify-between px-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold text-slate-900">
            {user?.restaurantName || "My Restaurant"}
          </h1>
        </div>
        <div className="ml-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="bg-slate-100 p-2 rounded-full">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-slate-600 hover:text-slate-900"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
