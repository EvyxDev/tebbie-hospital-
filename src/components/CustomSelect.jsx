/* eslint-disable react/prop-types */
import { ChevronDown, Search, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "اختر من القائمة...",
  searchable = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.id === value);

  const handleSelect = (option) => {
    onChange(option?.id || null);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Select Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          w-full flex items-center justify-between px-4 py-3
          bg-white border-2 rounded-xl
          text-right transition-all duration-200
          hover:border-green-300 hover:shadow-md
          focus:outline-none focus:border-green-500 focus:shadow-lg
          ${
            isOpen
              ? "border-green-500 shadow-lg ring-2 ring-green-100"
              : "border-gray-200"
          }
          ${selectedOption ? "text-gray-900" : "text-gray-500"}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="البحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-right border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {/* All Specializations Option */}
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-right
                  transition-colors duration-150 hover:bg-gray-50
                  ${!value ? "bg-green-50 text-green-700" : "text-gray-700"}
                `}
              >
                <span>كل التخصصات</span>
                {!value && <Check className="w-4 h-4 text-green-600 ml-2" />}
              </button>

              {/* Filtered Options */}
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-right
                    transition-colors duration-150 hover:bg-gray-50
                    ${
                      value === option.id
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700"
                    }
                  `}
                >
                  <span>{option.name}</span>
                  {value === option.id && (
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                  )}
                </button>
              ))}

              {/* No Results */}
              {searchTerm && filteredOptions.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>لم يتم العثور على نتائج</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomSelect;
