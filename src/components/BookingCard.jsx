import Switch from "./Switch";

const BookingCard = ({ booking, showSwitch = true, onStatusChange }) => {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status text
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "unpaid":
        return "غير مدفوع";
      case "pending":
        return "في الانتظار";
      default:
        return status;
    }
  };

  const handleSwitchChange = (checked) => {
    if (onStatusChange) {
      onStatusChange(booking.id, checked);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Booking Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">حجز رقم #{booking.id}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(booking.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusText(booking.status)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
              booking.payment_status
            )}`}
          >
            {getPaymentStatusText(booking.payment_status)}
          </span>
        </div>
      </div>

      {/* Doctor and Hospital Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل الطبيب</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">الاسم:</span>{" "}
              {booking.doctor?.name || "غير محدد"}
            </p>
            <p>
              <span className="text-gray-500">المستشفى:</span>{" "}
              {booking.hospital?.name || "غير محدد"}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل الموعد</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">التاريخ:</span>{" "}
              {formatDate(booking.date)}
            </p>
            <p>
              <span className="text-gray-500">السعر:</span> {booking.price} جنيه
            </p>
            <p>
              <span className="text-gray-500">نقاط مستخدمة:</span>{" "}
              {booking.value_used_points || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      {booking.user && (
        <div className="border-t pt-3">
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل المريض</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="text-gray-500">الاسم:</span>{" "}
                {booking.user.name || "غير محدد"}
              </p>
              <p>
                <span className="text-gray-500">رقم الهاتف:</span>{" "}
                {booking.user.phone || "غير محدد"}
              </p>
            </div>
            <div>
              <p>
                <span className="text-gray-500">نوع الحجز:</span>{" "}
                {booking.is_for_self ? "لنفسه" : "لشخص آخر"}
              </p>
              <p>
                <span className="text-gray-500">حالة الاسترداد:</span>{" "}
                {booking.is_refunded === "true"
                  ? "تم الاسترداد"
                  : "لم يتم الاسترداد"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Section */}
      {showSwitch && (
        <div className="border-t pt-3 mt-3">
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-1 justify-center items-center">
              <p className="text-[#8F9BB3] text-sm">تأكيد حضور</p>
              <Switch
                checked={booking.status === "completed"}
                onChange={handleSwitchChange}
              />
            </div>
            <div className="text-sm text-gray-500">
              آخر تحديث: {formatDate(booking.updated_at)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
