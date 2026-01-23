import { Card, CardContent } from "../ui/card";

export default function StatCard({ title, value, icon: Icon, iconColor = "text-orange-500" }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
          {Icon && (
            <div className="bg-slate-100 p-3 rounded-full">
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
