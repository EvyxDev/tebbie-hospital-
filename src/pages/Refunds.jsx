import Switch from "../components/Switch";
import { getRefunds } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery } from "@tanstack/react-query";

const Refunds = () => {
  const token = localStorage.getItem("authToken");

  const {
    data: refundsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["refunds"],
    queryFn: () => getRefunds({ token }),
  });

  console.log(refundsData);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p className="text-red-400">عذرا حدث خطأ ما</p>
      </div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col gap-6">
      <div className="w-full h-full">
        {refundsData?.length > 0 ? (
          refundsData.map((refund) => {
            const booking = refund.booking || {};
            const doctorName = booking?.doctor?.name || "غير معروف";
            const patientName = refund?.user?.name || "غير معروف";
            const status = refund?.booking?.status;
            const date = refund.created_at || "";

            const parsedDate = new Date(date);
            const formattedDate = new Intl.DateTimeFormat("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(parsedDate);

            return (
              <div
                key={refund.id}
                className="my-4 shadow-sm bg-white rounded-lg py-2 p-4 mt-8"
              >
                <span className="flex gap-2">
                  <div className="InputPrimary mt-1" />
                  <p className="font-medium">{formattedDate || "غير محدد"}</p>
                </span>
                <h3 className="text-xl font-normal my-1">{patientName}</h3>
                <div className="flex justify-between">
                  <h3 className="text-[#8F9BB3] text-md">{doctorName}</h3>
                  <div className="flex gap-1 justify-center items-center">
                    <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
                    <Switch checked={status === "finished"} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-gray-500 text-xl">لا توجد استردادات  متاحة</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Refunds;