
import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
const NotificationsHeader = () => {
    const navigate = useNavigate();
  

  
    const goBack = () => {
      navigate(-1);
    };
  return (
    <div className="w-full text-[#5E5F60] h-16 flex items-center justify-between">
    <div className="flex text-lg justify-center items-center gap-3">
      <button onClick={goBack} className="text-lg flex items-center gap-1">
        <FaArrowRightLong />
      </button>
      <h1 className="font-bold">الإشعارات</h1>
    </div>
   
  </div>
  )
}

export default NotificationsHeader
