import { createFileRoute, redirect } from "@tanstack/react-router";
import { Pill, MapPin, Calendar, TrendingUp } from "lucide-react";
import { useMedicines } from "../hooks/useMedicines";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: medicinesData, isLoading } = useMedicines();

  const medicines = medicinesData?.data || [];

  // Calculate stats
  const totalMedicines = medicines.length;
  const expiredMedicines = medicines.filter(
    (m) => m.expiryDate && new Date(m.expiryDate) < new Date()
  ).length;
  const expiringSoon = medicines.filter((m) => {
    if (!m.expiryDate) return false;
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return expiryDate > today && expiryDate <= thirtyDaysFromNow;
  }).length;

  const categories = medicines.reduce(
    (acc, medicine) => {
      acc[medicine.category] = (acc[medicine.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const recentMedicines = medicines
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your medicine inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Medicines
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalMedicines}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">
                {expiringSoon}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">
                {expiredMedicines}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(categories).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Categories
          </h2>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {count}
                </span>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No medicines added yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Medicines */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recently Added
          </h2>
          <div className="space-y-3">
            {recentMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {medicine.name}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {medicine.location}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(medicine.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
            {recentMedicines.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No medicines added yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
