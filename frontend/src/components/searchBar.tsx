import { useState } from "react";

interface SearchBarProps {
  placeholder?: string; // texte personnalisé
  onSearch?: (term: string) => void; // callback quand on tape
}

export default function SearchBar({ placeholder = "Rechercher...", onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value); // on notifie le parent
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      className="w-full p-2 mb-4 border rounded bg-white text-black"
    />
  );
}
