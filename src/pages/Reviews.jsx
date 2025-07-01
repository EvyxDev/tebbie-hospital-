import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "../components/LoaderComponent";
import { getreviews } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa6";
import { mainLogo } from "../assets";

const Reviews = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => getreviews({ token }),
  });
  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-2xl">
        <p className="text-red-500">
          عزرا حدث خطأ ما !
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 max-w-md mx-auto">
        <div className="flex text-lg text-[#5E5F60] justify-start items-center gap-3 p-4">
          <button onClick={goBack} className="text-lg flex items-center gap-1">
            <FaArrowRightLong />
          </button>
          <h1 className="font-bold">الآراء السابقة</h1>
        </div>
      </header>
      <div className="pt-20 ">
        <div className="grid gap-4">
        {reviewsData && reviewsData?.length > 0 ? (
        <div className="grid gap-4">
          {reviewsData?.map((review) => (
            <div
              key={review.id}
              className="flex items-start gap-4 border-[0.5px] shadow-sm rounded-2xl p-4"
            >
              <div className="w-20 h-20 rounded-3xl flex-shrink-0">
                <img
                  src={review.media_url || mainLogo}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full">
                  <p className="text-lg font-semibold text-black">
                    {review.user.name}
                  </p>
                  <span className="flex gap-1 text-lg">
                    <FaStar className="text-yellow-400" />
                    <p className="text-sm">{review.rating}</p>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {review.comment ? review.comment : "لا يوجد تعليق"}
                </p>
                <p className="text-xs text-gray-400 text-end">
                  {new Date(review.created_at).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-xl mt-8">
          لا توجد آراء متاحة حالياً
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
