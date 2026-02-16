import { Link } from "react-router-dom";
import {
  booking,
  reviewsIcon,
  walletIcon,
  itemIcon,
  packageIcon,
} from "../../assets";

const data = [
  {
    content: "الحجوزات",
    href: "medical-bookings",
    image: booking,
  },
  {
    content: "المحفظة",
    href: "medical-wallet",
    image: walletIcon,
  },
  {
    content: "الباقات الطبية",
    href: "medical-packages",
    image: packageIcon,
  },
  {
    content: "العناصر الطبية",
    href: "medical-items",
    image: itemIcon,
  },
  {
    content: "التقييمات",
    href: "medical-reviews",
    image: reviewsIcon,
  },
];

const DashboardMedical = () => {
  return (
    <section className="h-full flex flex-col my-8 w-full">
      <div className="w-full flex flex-wrap gap-2 my-4">
        {data.map((item) => (
          <Link
            to={`${item.href}`}
            key={item.content}
            className="bg-[#F3F3F3] flex-col w-[49%] flex gap-2 rounded-lg text-center justify-center items-center py-8 relative"
          >
            <div className="w-16">
              <img src={item.image} alt={item.content} className="w-16" />
            </div>
            <h2 className="text-black font-[500]"> {item.content}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DashboardMedical;
