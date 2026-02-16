import { useQuery } from "@tanstack/react-query";
import { getMedicalItems } from "../../utlis/https";
import { Microscope, Activity, Tag, AlertCircle } from "lucide-react";
import LoaderComponent from "../../components/LoaderComponent";

const MedicalItems = () => {
  const token = localStorage.getItem("authToken");

  const { data: response, isLoading } = useQuery({
    queryKey: ["medical-items"],
    queryFn: () => getMedicalItems(token),
  });

  if (isLoading) return <LoaderComponent />;

  const items = response || [];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              الفحوصات المتاحة
            </h1>
            <p className="text-gray-500 text-[12px] mt-1">
              قائمة بجميع أنواع التحاليل والأشعة وأسعارها
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-[12px] text-gray-500">عدد العناصر: </span>
            <span className="font-bold text-blue-600">{items?.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {response && response?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden"
              dir="auto"
            >
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      item.type === "radiology"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {item.type === "radiology" ? (
                      <Activity size={20} />
                    ) : (
                      <Microscope size={20} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-md font-bold text-gray-900 mt-3 mb-2 leading-tight">
                        {item.name}
                      </h3>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          item.type === "radiology"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.type === "radiology" ? "أشعة" : "تحليل"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(item.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {(item?.notes || []) && item?.notes?.length > 0 && (
                  <div className="bg-amber-50/60 rounded-xl p-3 border-r-4 border-amber-400">
                    <p className="text-[11px] font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <AlertCircle size={12} /> تعليمات هامة:
                    </p>
                    <ul className="text-[10px] text-amber-900/80 space-y-0.5">
                      {item.notes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[12px] mb-1 text-gray-600 font-medium">
                      سعر الخدمة:
                    </p>
                    <p className="text-[12px] font-black text-center leading-none text-gray-800">
                      {item.service_price} ج.م
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[12px] mb-1 text-gray-600 font-medium">
                      سعر طبي:
                    </p>
                    <p className="text-[12px] font-black text-center leading-none text-gray-800 ">
                      {item.tabi_price} ج.م
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[12px] mb-1 text-gray-600 font-medium">
                      إجمالي السعر
                    </span>
                    <p className="text-[12px] mt-1 text-center font-black leading-none text-gray-800 ">
                      {item.price} ج.م
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalItems;




