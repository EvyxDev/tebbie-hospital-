import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllServices } from "../utlis/https";

export default function Services() {
  const token = localStorage.getItem("authToken");

  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServices({ token }),
    enabled: !!token,
    staleTime: 60_000,
  });

  if (isLoading)
    return <div className="w-full p-4 text-center">جاري تحميل الخدمات...</div>;
  if (error)
    return <div className="w-full p-4 text-center text-red-500">حدث خطأ</div>;

  if (!data || data.length === 0)
    return <div className="w-full p-4 text-center">لا توجد خدمات حالياً</div>;

  return (
    <section className="w-full h-full p-4">
      <h2 className="text-lg font-semibold mb-4">الخدمات</h2>
      <div className="flex flex-col gap-3">
        {data.map((service) => (
          <div key={service.id} className="bg-white shadow-sm rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-medium">
                  {service.name || `خدمة #${service.id}`}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  الحالة: {service.status === "active" ? "نشطة" : "غير نشطة"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/service-slots/${service.id}`}
                className="flex-1 bg-[#33A9C7] text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-[#2a8ba3] transition-colors"
              >
                عرض الفترات
              </Link>
              <Link
                to={`/service-bookings/${service.id}`}
                className="flex-1 bg-[#3AAB95] text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-[#2e8a6b] transition-colors"
              >
                عرض الحجوزات
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
