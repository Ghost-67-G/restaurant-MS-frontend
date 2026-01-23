import { Utensils } from "lucide-react";

export default function MobileLogo() {
  return (
    <div className="lg:hidden flex items-center gap-2 mb-6">
      <div className="bg-orange-500 p-2 rounded-lg">
        <Utensils className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold">DevsDesk</span>
    </div>
  );
}
