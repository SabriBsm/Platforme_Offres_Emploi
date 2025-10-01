import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type OfferFormData = {
  id?: number;
  title: string;
  description: string;
  location: string;
  type: string;
  start_date: string | null;
  end_date?: string | null;
};

interface OfferFormProps {
  offer: OfferFormData;
  onChange: (offer: OfferFormData) => void;
  onSave: (offer: OfferFormData) => void;
  onCancel: () => void;
}

export default function OfferForm({
  offer,
  onChange,
  onSave,
  onCancel,
}: OfferFormProps) {
  const [localOffer, setLocalOffer] = useState<OfferFormData>(offer);
  const isFirstLoad = useRef(true);

  // ⚡ Évite de réinitialiser l'offre après un succès
  useEffect(() => {
    if (isFirstLoad.current) {
      setLocalOffer(offer);
      isFirstLoad.current = false;
    }
  }, [offer]);

  

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleChange = (field: keyof OfferFormData, value: string | null) => {
    const updatedOffer = { ...localOffer, [field]: value };
    setLocalOffer(updatedOffer);
    onChange(updatedOffer);
  };

  const handleDateChange = (field: keyof OfferFormData, date: Date | null) => {
    handleChange(field, date ? formatDate(date) : null);
  };

  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 7);

  const getMinEndDate = () => {
    if (!localOffer.start_date) return new Date();
    const start = parseDate(localOffer.start_date);
    if (!start) return new Date();
    start.setDate(start.getDate() + 15);
    return start;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanOffer = {
      ...localOffer,
      start_date: localOffer.start_date
        ? formatDate(new Date(localOffer.start_date))
        : null,
      end_date: localOffer.end_date
        ? formatDate(new Date(localOffer.end_date))
        : null,
    };

    onSave(cleanOffer);

    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
     

      {/* Titre */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-semibold">Titre</label>
        <input
          type="text"
          required
          value={localOffer.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Description</label>
        <textarea
          value={localOffer.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Lieu */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-semibold">Lieu</label>
        <input
          type="text"
          value={localOffer.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
      </div>

      {/* Type */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-semibold">Type</label>
        <select
          required
          value={localOffer.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="border p-2 rounded flex-1"
        >
          <option value="">Sélectionner un type</option>
          <option value="stage">Stage</option>
          <option value="emploi">Emploi</option>
        </select>
      </div>

      {/* Dates */}
      <div className="flex gap-6">
        <div className="flex flex-col flex-1">
          <label className="font-semibold">Date de début</label>
          <DatePicker
            required
            selected={parseDate(localOffer.start_date)}
            onChange={(date) => handleDateChange("start_date", date)}
            className="border p-2 rounded w-full"
            dateFormat="yyyy-MM-dd"
            minDate={minStartDate}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="font-semibold">Date de fin</label>
          <DatePicker
            selected={parseDate(localOffer.end_date || null)}
            onChange={(date) => handleDateChange("end_date", date)}
            className="border p-2 rounded w-full"
            dateFormat="yyyy-MM-dd"
            minDate={getMinEndDate()}
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
