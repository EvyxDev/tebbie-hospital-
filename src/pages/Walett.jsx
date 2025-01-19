import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { getWallet } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";
import { dollarIcon, statics } from "../assets";

const Walett = () => {
  const token = localStorage.getItem("authToken");

  const {
    data: walletData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => getWallet({ token }),
  });

  const totalPrice = walletData?.reduce((total, wallet) => {
    const price = parseFloat(wallet?.price) || 0;  
    return total + price;
  }, 0);

  const formattedPrice = totalPrice ? totalPrice.toFixed(2) : "0.00";

  
  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-sm text-red-400">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <section className="z-10">
      <div className="sticky top-0  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] h-28 rounded-2xl  p-4 z-10">
        <div className="text-white flex gap-3 items-center text-md">
          <img alt="statics Icon" className="w-5" src={statics} />
          <p>الحساب</p>
        </div>
        <div className="flex  items-center justify-between">
          <p className="text-2xl text-white my-2"> LD {formattedPrice}</p>
          <Link
            to="/wallet/1"
            className="flex gap-1 items-center  text-base  text-[#5E5F60] bg-[#D6EEF6] p-2 w-22 rounded-full"
          >
            التفاصيل
            <IoIosArrowBack size={17} />
          </Link>
        </div>
      </div>
      <h2 className="text-black font-[500] text-lg my-6">المعاملات</h2>

      {walletData && walletData.length > 0 ? (
        walletData.map((wallet) => {
          const doctor = wallet?.booking?.doctor?.name || "غير معروف";
          const amount = wallet?.price || "غير محدد";
          return (
            <div
              key={wallet.id}
              className="flex justify-between items-center my-8"
            >
              <div className="flex gap-4">
                <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                  <img className="w-12" alt=" dollar Icon" src={dollarIcon} />
                </div>

                <div className="flex-col flex space-y-2">
                  <h2 className="font-medium text-md">{doctor}</h2>
                  <p className="text-xl font-semibold">{amount} دينار ليبي</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-[50vh] w-full flex justify-center items-center text-lg">
          <p>عذرا لا يوجد بيانات لعرضها</p>
        </div>
      )}
    </section>
  );
};

export default Walett;
