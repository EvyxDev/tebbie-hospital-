/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useField } from "formik";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

export const CustomTimeField = ({
  name,
  className,
  placeholder = "اختر الوقت",
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse the time value or set defaults
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: 12, minutes: 0, period: "AM" };
    const [hours, minutes] = timeStr.split(":").map(Number);
    return {
      hours: hours === 0 ? 12 : hours > 12 ? hours - 12 : hours,
      minutes: minutes,
      period: hours >= 12 ? "PM" : "AM",
    };
  };

  const [time, setTime] = useState(() => parseTime(field.value));

  const formatDisplayTime = () => {
    if (!field.value) return placeholder;
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")} ${time.period}`;
  };

  const updateTime = (newTime) => {
    setTime(newTime);
    // Convert to 24-hour format for form
    const adjustedHours =
      newTime.period === "PM" && newTime.hours !== 12
        ? newTime.hours + 12
        : newTime.period === "AM" && newTime.hours === 12
        ? 0
        : newTime.hours;
    const timeString = `${adjustedHours
      .toString()
      .padStart(2, "0")}:${newTime.minutes.toString().padStart(2, "0")}`;
    helpers.setValue(timeString);
  };

  const incrementValue = (type) => {
    const newTime = { ...time };
    if (type === "hours") {
      newTime.hours = newTime.hours === 12 ? 1 : newTime.hours + 1;
    } else if (type === "minutes") {
      newTime.minutes = newTime.minutes === 59 ? 0 : newTime.minutes + 1;
    } else if (type === "period") {
      newTime.period = newTime.period === "AM" ? "PM" : "AM";
    }
    updateTime(newTime);
  };

  const decrementValue = (type) => {
    const newTime = { ...time };
    if (type === "hours") {
      newTime.hours = newTime.hours === 1 ? 12 : newTime.hours - 1;
    } else if (type === "minutes") {
      newTime.minutes = newTime.minutes === 0 ? 59 : newTime.minutes - 1;
    } else if (type === "period") {
      newTime.period = newTime.period === "AM" ? "PM" : "AM";
    }
    updateTime(newTime);
  };

  // Sync time state when field value changes externally
  React.useEffect(() => {
    if (field.value) {
      setTime(parseTime(field.value));
    }
  }, [field.value]);

  return (
    <div className="w-full">
      {/* Display Input - uses the exact same className as your original Field */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${className} cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-gray-50 relative`}
      >
        <div className="flex items-center gap-2 flex-1">
          <Clock size={18} className="text-gray-400" />
          <span className={field.value ? "text-gray-700" : "text-gray-400"}>
            {formatDisplayTime()}
          </span>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Expanded Time Picker */}
      {isExpanded && (
        <div className="absolute z-50 left-0 bottom-0  mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-lg w-full">
          <div className="flex justify-center gap-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => incrementValue("hours")}
                className="p-1 hover:bg-blue-50 rounded-full transition-colors"
              >
                <ChevronUp size={18} className="text-blue-500" />
              </button>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg my-2 text-blue-600 font-bold">
                {time.hours.toString().padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={() => decrementValue("hours")}
                className="p-1 hover:bg-blue-50 rounded-full transition-colors"
              >
                <ChevronDown size={18} className="text-blue-500" />
              </button>
              <span className="text-xs text-gray-500 mt-1">ساعة</span>
            </div>

            {/* Separator */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-300 mt-4">:</div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => incrementValue("minutes")}
                className="p-1 hover:bg-green-50 rounded-full transition-colors"
              >
                <ChevronUp size={18} className="text-green-500" />
              </button>
              <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-lg my-2 text-green-600 font-bold">
                {time.minutes.toString().padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={() => decrementValue("minutes")}
                className="p-1 hover:bg-green-50 rounded-full transition-colors"
              >
                <ChevronDown size={18} className="text-green-500" />
              </button>
              <span className="text-xs text-gray-500 mt-1">دقيقة</span>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => incrementValue("period")}
                className="p-1 hover:bg-purple-50 rounded-full transition-colors"
              >
                <ChevronUp size={18} className="text-purple-500" />
              </button>
              <div className="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-lg my-2 text-purple-600 font-bold text-sm">
                {time.period}
              </div>
              <button
                type="button"
                onClick={() => decrementValue("period")}
                className="p-1 hover:bg-purple-50 rounded-full transition-colors"
              >
                <ChevronDown size={18} className="text-purple-500" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              تأكيد
            </button>
            <button
              type="button"
              onClick={() => {
                const resetTime = { hours: 12, minutes: 0, period: "AM" };
                setTime(resetTime);
                helpers.setValue("");
                setIsExpanded(false);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              مسح
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
