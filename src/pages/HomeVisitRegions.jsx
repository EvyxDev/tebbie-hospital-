import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHomeVisitRegions,
  addHomeVisitRegion,
  updateHomeVisitRegion,
  getCities,
  getRegionsByCity,
} from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaCity } from "react-icons/fa";
import { BiShekel } from "react-icons/bi";
import { IoArrowBack, IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HomeVisitRegions = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);

  // Form state
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [locationPrice, setLocationPrice] = useState("");
  const [status, setStatus] = useState("active");

  const {
    data: regions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-visit-regions"],
    queryFn: () => getHomeVisitRegions({ token }),
  });

  // Fetch cities
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getCities({ token }),
  });

  // Fetch regions based on selected city
  const { data: cityRegions, isLoading: isLoadingRegions } = useQuery({
    queryKey: ["city-regions", selectedCityId],
    queryFn: () => getRegionsByCity({ token, city_id: selectedCityId }),
    enabled: !!selectedCityId,
    retry: false, // Don't retry if no regions found
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Add mutation
  const addMutation = useMutation({
    mutationFn: addHomeVisitRegion,
    onSuccess: () => {
      queryClient.invalidateQueries(["home-visit-regions"]);
      setIsModalOpen(false);
      resetForm();
      alert("تمت إضافة المنطقة بنجاح");
    },
    onError: (error) => {
      alert(error.message || "فشل في إضافة المنطقة");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateHomeVisitRegion,
    onSuccess: () => {
      queryClient.invalidateQueries(["home-visit-regions"]);
      setIsModalOpen(false);
      resetForm();
      alert("تم تحديث المنطقة بنجاح");
    },
    onError: (error) => {
      alert(error.message || "فشل في تحديث المنطقة");
    },
  });

  const resetForm = () => {
    setSelectedCityId("");
    setSelectedRegionId("");
    setLocationPrice("");
    setStatus("active");
    setEditingRegion(null);
  };

  // Reset form and clear cache when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  const handleOpenModal = (region = null) => {
    if (region) {
      setEditingRegion(region);
      setSelectedCityId(String(region.city_id));
      setSelectedRegionId(String(region.region_id));
      setLocationPrice(region.location_price);
      setStatus(region.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCityId || !selectedRegionId || !locationPrice) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    // Check if there are no regions available for the selected city
    if (selectedCityId && (!cityRegions || cityRegions.length === 0)) {
      alert("لا توجد مناطق متاحة لهذه المدينة. الرجاء اختيار مدينة أخرى.");
      return;
    }

    const data = {
      token,
      city_id: parseInt(selectedCityId),
      region_id: parseInt(selectedRegionId),
      location_price: locationPrice,
      status,
    };

    if (editingRegion) {
      updateMutation.mutate({ ...data, id: editingRegion.id });
    } else {
      addMutation.mutate(data);
    }
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-2xl">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <section className="h-full flex flex-col my-8 w-full px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          مناطق الزيارة المنزلية
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white p-2 rounded-full hover:shadow-lg transition-all"
        >
          <IoAdd size={24} />
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">إجمالي المناطق</p>
            <p className="text-3xl font-bold">{regions?.length || 0}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <MdLocationOn size={32} />
          </div>
        </div>
      </div>

      {/* Regions List */}
      {regions && regions.length > 0 ? (
        <div className="space-y-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 relative"
            >
              <button
                onClick={() => handleOpenModal(region)}
                className="absolute left-3 top-3 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white p-2 rounded-lg hover:shadow-md transition-all"
              >
                <MdEdit size={18} />
              </button>

              <div className="flex items-start justify-between mb-4 pr-0">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-3 rounded-full">
                    <MdLocationOn size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {region.region?.name || "N/A"}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <FaCity size={14} />
                      <span>{region.city?.name || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ml-12 ${
                    region.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {region.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <BiShekel size={20} className="text-gray-600" />
                  <span className="text-gray-600 text-sm">سعر المنطقة:</span>
                </div>
                <span className="text-2xl font-bold text-gradient-to-bl from-[#33A9C7] to-[#3AAB95]">
                  {region.location_price} د.ل
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                آخر تحديث:{" "}
                {new Date(region.updated_at).toLocaleDateString("ar-LY", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[50vh] w-full flex flex-col justify-center items-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <MdLocationOn size={48} className="text-gray-400" />
          </div>
          <p className="text-xl text-gray-600">لا توجد مناطق لعرضها</p>
          <p className="text-sm text-gray-400 mt-2">
            لم يتم إضافة أي مناطق للزيارة المنزلية بعد
          </p>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info?.offset?.y && info.offset.y > 150) {
                  setIsModalOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>

              <h2 className="text-xl font-bold text-center mb-6">
                {editingRegion ? "تعديل المنطقة" : "إضافة منطقة جديدة"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* City Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      setSelectedCityId(e.target.value);
                      setSelectedRegionId(""); // Reset region when city changes
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33A9C7]"
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {cities?.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33A9C7] ${
                      selectedCityId &&
                      !isLoadingRegions &&
                      (!cityRegions || cityRegions.length === 0)
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    disabled={!selectedCityId || isLoadingRegions}
                  >
                    <option value="">
                      {isLoadingRegions ? "جاري التحميل..." : "اختر المنطقة"}
                    </option>
                    {cityRegions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {!selectedCityId && (
                    <p className="text-xs text-gray-500 mt-1">
                      الرجاء اختيار المدينة أولاً
                    </p>
                  )}
                  {selectedCityId && isLoadingRegions && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <svg
                        className="animate-spin h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري تحميل المناطق...
                    </p>
                  )}
                  {selectedCityId &&
                    !isLoadingRegions &&
                    (!cityRegions || cityRegions.length === 0) && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        لا توجد مناطق متاحة لهذه المدينة
                      </p>
                    )}
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر المنطقة (د.ل) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={locationPrice}
                    onChange={(e) => setLocationPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33A9C7]"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33A9C7]"
                    required
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={
                      addMutation.isPending ||
                      updateMutation.isPending ||
                      isLoadingRegions ||
                      (selectedCityId &&
                        (!cityRegions || cityRegions.length === 0))
                    }
                    className="flex-1 py-3 px-4 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addMutation.isPending || updateMutation.isPending
                      ? "جاري الحفظ..."
                      : isLoadingRegions
                      ? "جاري التحميل..."
                      : editingRegion
                      ? "تحديث"
                      : "إضافة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeVisitRegions;
