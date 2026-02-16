import { useQuery } from "@tanstack/react-query";
import { getMedicalPackages } from "../../utlis/https";
import {
  Package,
  Activity,
  Info,
  // Tag as TagIcon,
  // CheckCircle,
  // XCircle,
} from "lucide-react";
import LoaderComponent from "../../components/LoaderComponent";

const MedicalPackages = () => {
  const token = localStorage.getItem("authToken");

  const { data: response, isLoading } = useQuery({
    queryKey: ["medical-packages"],
    queryFn: () => getMedicalPackages(token),
  });

  if (isLoading) return <LoaderComponent />;

  const packages = (response || []).map((pkg) => ({
    ...pkg,
    items: (pkg.items || []).map((item) => ({
      ...item,
      tags: item.tags || [],
      notes: item.notes || [],
    })),
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">
            باقات الخدمات الطبية
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            تصفح وإدارة باقات التشخيص الطبي المتاحة.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Package Header */}
              <div className="p-5 border-b border-gray-50 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-1 px-2 bg-blue-50 rounded-lg text-blue-600">
                    <Package size={18} />
                  </div>
                  <span
                    className={`px-3  rounded-full text-xs font-medium ${pkg.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {pkg.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 className="text-md font-bold text-gray-900">{pkg.name}</h3>
              </div>

              {/* Pricing Section */}
              <div className="px-5 -mt-1 bg-gray-50/50 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-gray-500">السعر الكلي:</p>
                  <p className="text-sm font-black text-blue-600 font-mono">
                    {pkg.price} <span className="text-sm">د.ل</span>
                  </p>
                </div>
                {/* <div className="text-right">
                  <p className="text-xs font-bold text-gray-600">
                    سعر طبي: {pkg.tabi_price} د.ل
                  </p>
                </div> */}
              </div>

              {/* Items List */}
              <div className="p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Activity size={16} /> محتويات الباكدج (
                  {pkg.items?.length || 0})
                </h4>

                {pkg.items?.length > 0 ? (
                  <div className="space-y-4">
                    {pkg.items.map((item) => (
                      <div
                        key={item.id}
                        className="text-sm border-l-2 border-blue-200 pl-3 py-1"
                      >
                        <div className="flex justify-between font-medium text-gray-800">
                          <span>{item.name}</span>
                          <span className="text-blue-600">
                            {item.price} د.ل
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-500 uppercase tracking-wider"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Notes */}
                        {item.notes.length > 0 && (
                          <div className="mt-2 text-[12px] text-gray-500 bg-blue-50/50 p-2 rounded">
                            {item.notes.map((note, idx) => (
                              <p
                                key={idx}
                                className="flex items-center gap-1 italic"
                              >
                                <Info size={12} /> {note}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic py-4 text-center">
                    No individual items listed.
                  </p>
                )}
              </div>

              {/* Action Button */}
              {/* <div className="p-5 pt-0">
                <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  View Details
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalPackages;
