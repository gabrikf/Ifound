import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { useMedicines, useDeleteMedicine } from "../../hooks/useMedicines";
import { MedicineCard } from "../../components/MedicineCard";
import type { Medicine } from "../../types";

export const Route = createFileRoute("/medicines/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Medicines,
});

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const { data: medicinesData, isLoading } = useMedicines();
  const deleteRemediateMutation = useDeleteMedicine();

  // The API returns medicines directly in data, not wrapped in a medicines property
  const medicines = medicinesData?.data || [];

  // Get unique categories and locations for filters
  const categories = [...new Set(medicines.map((m) => m.category))].sort();
  const locations = [...new Set(medicines.map((m) => m.location))].sort();

  // Filter medicines based on search and filters
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || medicine.category === selectedCategory;
    const matchesLocation =
      !selectedLocation || medicine.location === selectedLocation;

    const isExpired =
      medicine.expiryDate && new Date(medicine.expiryDate) < new Date();
    const matchesExpiredFilter = !showExpiredOnly || isExpired;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesExpiredFilter
    );
  });

  const handleDelete = async (medicine: Medicine) => {
    if (window.confirm(`Are you sure you want to delete "${medicine.name}"?`)) {
      try {
        await deleteRemediateMutation.mutateAsync(medicine.id);
      } catch (error) {
        console.error("Failed to delete medicine:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Medicines
          </h1>
          <p className="text-gray-600">
            {filteredMedicines.length} of {medicines.length} medicines
          </p>
        </div>
        <Link
          to="/medicines/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* Expired Filter */}
          <div className="flex items-center space-x-2">
            <input
              id="expired-filter"
              type="checkbox"
              checked={showExpiredOnly}
              onChange={(e) => setShowExpiredOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="expired-filter" className="text-sm text-gray-700">
              Expired only
            </label>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedLocation("");
              setShowExpiredOnly(false);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear filters
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Grid/List */}
      {filteredMedicines.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <Filter className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No medicines found
          </h3>
          <p className="text-gray-500 mb-6">
            {medicines.length === 0
              ? "You haven't added any medicines yet."
              : "Try adjusting your search or filters."}
          </p>
          <Link
            to="/medicines/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Medicine
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={(medicine) => {
                // Navigate to edit page - we'll implement this route next
                window.location.href = `/medicines/${medicine.id}/edit`;
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
