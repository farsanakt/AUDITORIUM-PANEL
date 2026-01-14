import { useState } from "react";
import { MapPin } from "lucide-react";
import { useLocationIQ } from "./useLocationIQ";
import { LocationResult } from "./types";

interface Props {
  value: string;
  placeholder?: string;
  onSelect: (location: LocationResult) => void;
}

const LocationAutocomplete = ({
  value,
  placeholder = "Enter your location",
  onSelect,
}: Props) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);

  const { results, loading } = useLocationIQ(query);

  const handleSelect = (item: LocationResult) => {
    setQuery(item.displayName);
    setOpen(false);
    onSelect(item);
  };

  // ✅ show dropdown ONLY when query length >= 2
  const shouldShowDropdown = open && query.trim().length >= 2;

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
        />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(value.trim().length >= 2);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          className="
            w-full h-11
            pl-9 pr-4
            bg-white
            border border-gray-200
            rounded-lg
            text-sm text-gray-800
            placeholder:text-gray-400
            focus:outline-none
          "
        />
      </div>

      {/* DROPDOWN */}
      {shouldShowDropdown && (
        <div
          className="
            absolute z-50 mt-1
            w-[92%] left-1/2 -translate-x-1/2
            bg-white
            border border-gray-100
            rounded-xl
            shadow-md
            max-h-56 overflow-y-auto no-scrollbar
          "
        >
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500">
              Searching…
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500">
              No locations found
            </div>
          )}

          {!loading &&
            results.map((item, index) => {
              const [title, ...rest] = item.displayName.split(",");
              const subtitle = rest.slice(0, 2).join(",").trim();

              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="
                    flex items-start gap-2
                    px-3 py-1.5
                    cursor-pointer
                    hover:bg-gray-50
                    border-b border-gray-100 last:border-b-0
                  "
                >
                  {/* ICON */}
                  <MapPin
                    size={13}
                    className="mt-0.5 text-gray-600 shrink-0"
                  />

                  {/* TEXT */}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-gray-800 leading-tight">
                      {title}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">
                      {subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
