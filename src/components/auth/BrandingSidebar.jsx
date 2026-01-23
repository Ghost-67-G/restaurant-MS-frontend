import { Utensils, ChefHat, ClipboardList, BarChart3 } from "lucide-react";

export default function BrandingSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-slate-900 text-white flex-col justify-between p-10 xl:p-12">
      <div>
        <div className="flex items-center gap-2 mb-16">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Utensils className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">DevsDesk</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            All-in-One Restaurant Management
          </h1>
          <p className="text-lg text-slate-300 mb-12">
            POS · Inventory · Orders · Reports
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <ChefHat className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Point of Sale</h3>
                <p className="text-sm text-slate-400">Fast, intuitive POS for your restaurant</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Inventory Management</h3>
                <p className="text-sm text-slate-400">Track stock levels in real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics & Reports</h3>
                <p className="text-sm text-slate-400">Make data-driven decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-slate-400">
        © 2026 DevsDesk. All rights reserved.
      </div>
    </div>
  );
}
