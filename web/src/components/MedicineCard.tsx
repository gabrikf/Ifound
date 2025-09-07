import { Calendar, MapPin, Package, Trash2, Edit } from "lucide-react";
import type { Medicine } from "../types";

interface MedicineCardProps {
  medicine: Medicine;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicine: Medicine) => void;
}

export const MedicineCard = ({
  medicine,
  onEdit,
  onDelete,
}: MedicineCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return expiryDate > today && expiryDate <= thirtyDaysFromNow;
  };

  const getExpiryStatus = () => {
    if (isExpired(medicine.expiryDate)) {
      return { text: "Expired", color: "text-red-600 bg-red-50" };
    }
    if (isExpiringSoon(medicine.expiryDate)) {
      return {
        text: "Próximo ao vencimento",
        color: "text-orange-600 bg-orange-50",
      };
    }
    return null;
  };

  const expiryStatus = getExpiryStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {medicine.name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {medicine.category}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(medicine)}
                className="p-1 hover:bg-gray-100 rounded-lg"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(medicine)}
                className="p-1 hover:bg-gray-100 rounded-lg"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
              </button>
            )}
          </div>
        </div>

        {medicine.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {medicine.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {medicine.location}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-2" />
            {medicine.quantity} unidade{medicine.quantity !== 1 ? "s" : ""}
          </div>

          {medicine.expiryDate && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span
                className={
                  isExpired(medicine.expiryDate)
                    ? "text-red-600"
                    : "text-gray-500"
                }
              >
                Vencimento: {formatDate(medicine.expiryDate)}
              </span>
            </div>
          )}
        </div>

        {expiryStatus && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${expiryStatus.color}`}
            >
              {expiryStatus.text}
            </span>
          </div>
        )}

        {medicine.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 line-clamp-2">
              <strong>Anotações:</strong> {medicine.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
