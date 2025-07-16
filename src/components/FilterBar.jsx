import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({ label, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col w-[45%]">
      <label className="text-sm font-semibold text-gray-700 mb-3 text-right">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="appearance-none w-full px-4 py-3 pl-10 pr-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 text-sm font-medium focus:ring-2 focus:ring-[#3AAB95] focus:border-[#3AAB95] outline-none transition-all duration-300 hover:border-gray-300 hover:shadow-md cursor-pointer text-right flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`${selectedOption ? "text-gray-800" : "text-gray-500"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 absolute left-3 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`px-4 py-3 text-right cursor-pointer transition-all duration-200 text-sm font-medium
                  ${index === 0 ? "rounded-t-xl" : ""}
                  ${index === options.length - 1 ? "rounded-b-xl" : ""}
                  ${
                    value === option.value
                      ? "bg-[#3AAB95] text-white"
                      : "text-gray-800 hover:bg-gray-50 hover:text-[#3AAB95]"
                  }
                  ${
                    index !== options.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                `}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterBar = ({ data, setFilteredData }) => {
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");

  const sortOptions = [
    { value: "created_at", label: "تاريخ الإنشاء" },
    { value: "date", label: "تاريخ الحجز" },
  ];

  const statusOptions = [
    { value: "", label: "الكل" },
    { value: "pending", label: "قيد الانتظار" },
    { value: "accepted", label: "تم القبول" },
    { value: "rejected", label: "تم الرفض" },
    { value: "completed", label: "مكتمل" },
  ];

  const handleSortChange = (field) => {
    setSortField(field);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const result = useMemo(() => {
    let result = [...data];

    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (sortField) {
      result.sort((a, b) => {
        const aVal = new Date(a[sortField]);
        const bVal = new Date(b[sortField]);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [data, sortField, sortOrder, statusFilter]);

  useEffect(() => {
    setFilteredData(result);
  }, [result, setFilteredData]);

  return (
    <div className="flex flex-wrap justify-between gap-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-12">
      <CustomSelect
        label="ترتيب حسب"
        value={sortField}
        onChange={handleSortChange}
        options={sortOptions}
        placeholder="بدون ترتيب "
      />

      <CustomSelect
        label="الحالة"
        value={statusFilter}
        onChange={handleStatusFilterChange}
        options={statusOptions}
        placeholder="الكل"
      />
    </div>
  );
};

export default FilterBar;
