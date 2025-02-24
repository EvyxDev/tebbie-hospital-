import { BsSearch } from 'react-icons/bs'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'

const SpecializationHeader = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
      };
  return (
   <div className="w-full text-[#5E5F60] h-16 flex items-center justify-between p-4">
   <div className="flex text-lg justify-center items-center gap-3">
     <button onClick={goBack} className="text-lg flex items-center gap-1">
       <FaArrowRightLong />
     </button>
     <h1 className="font-bold"> بيانات التخصص</h1>
   </div>
   <div className="flex items-center gap-2">
     <Link
       to="/search"
       className="bg-[#F5F5F5] rounded-full p-3 rotate-90"
     >
       <BsSearch size={22} alt="Notifications" />
     </Link>
   </div>
 </div>
  )
}

export default SpecializationHeader
