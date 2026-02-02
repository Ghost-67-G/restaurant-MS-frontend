import { Link, useLocation } from "react-router-dom";
import { Utensils, LayoutDashboard, ShoppingCart, ClipboardList, UtensilsCrossed, Package, BarChart3, Users,Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/auth.store";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner"] },
  { name: "Kitchen", href: "/kitchen", icon: LayoutDashboard, roles: ["kitchen"] },
  { name: "POS", href: "/pos", icon: ShoppingCart, roles: ["owner", "cashier"] },
  { name: "Orders", href: "/orders", icon: ClipboardList, roles: ["owner", "cashier", "kitchen"] },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed, roles: ["owner"] },
  { name: "Inventory", href: "/inventory", icon: Package, roles: ["owner"] },
  { name: "Users", href: "/users", icon: Users, roles: ["owner"] },
  { name: "Tax Settings", href: "/tax-settings", icon: Settings, roles: ["owner"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["owner"], disabled: true },
];

export default function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  
  const userRole = user?.role || "owner";

  // Filter navigation based on user role
  const accessibleNav = navigation.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-white">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 shrink-0 px-6 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Utensils className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">DevsDesk</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {accessibleNav.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return item.disabled ? (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 cursor-not-allowed"
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
