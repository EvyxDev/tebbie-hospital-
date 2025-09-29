/* eslint-disable no-useless-catch */
const API_URL = import.meta.env.VITE_APP_API_URL;

// Get employee roles
export const getEmployeeRoles = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/employee-roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch employee roles");
    }
  } catch (error) {
    throw error;
  }
};

// Get employee permissions
export const getEmployeePermissions = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/employee-permissions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch employee permissions");
    }
  } catch (error) {
    throw error;
  }
};

// Create employee role
export const createEmployeeRole = async ({
  token,
  hospital_id,
  name,
  display_name,
  permissions,
}) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/employee-roles`, {
      method: "POST",
      body: JSON.stringify({
        name,
        display_name,
        permissions,
        hospital_id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to create employee role");
    }
  } catch (error) {
    throw error;
  }
};

export const getReviews = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllServices = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-all-services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch services data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getSpecializations = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-specializations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch specializations data"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getDoctors = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getDoctorsBooking = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/get-doctors-by-specialization/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getNotifications = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/notification-hospital`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const assignSpecialization = async ({
  token,
  specialization_id,
  price,
  doctor_id,
  waiting_time,
  slots,
}) => {
  const formdata = new FormData();
  formdata.append("specialization_id", specialization_id);
  formdata.append("price", price);
  formdata.append("doctor_id", doctor_id);
  formdata.append("waiting_time", waiting_time);

  slots.forEach((slot, index) => {
    formdata.append(`slots[${index}][day_id]`, slot.day_id);
    formdata.append(`slots[${index}][start_time]`, slot.start_time);
    formdata.append(`slots[${index}][end_time]`, slot.end_time);
  });

  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/assignSpecializations`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateSpecialization = async ({
  token,
  specialization_id,
  price,
  waiting_time,
  doctor_id,
  slots,
  deleted_slots,
}) => {
  const payload = {
    specialization_id: Number(specialization_id),
    price: Number(price),
    doctor_id: Number(doctor_id),
    slots: slots.map((slot) => ({
      day_id: Number(slot.day_id),
      start_time: slot.start_time,
      end_time: slot.end_time,
    })),
    deleted_slots: deleted_slots.map(Number),
    slot_type: "slots",
  };
  if (
    waiting_time !== undefined &&
    waiting_time !== null &&
    waiting_time !== "" &&
    !isNaN(Number(waiting_time)) &&
    Number(waiting_time) >= 0
  ) {
    payload.waiting_time = Number(waiting_time);
  }
  try {
    const response = await fetch(`${API_URL}/hospital/v1/update-doctor-slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor slot"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateDoctorIntervals = async ({
  token,
  price,
  doctor_id,
  intervals,
  deleted_intervals,
}) => {
  try {
    for (const interval of intervals) {
      const payload = {
        price: price ? Number(price) : 0,
        relatable_id: Number(doctor_id),
        date: interval.date,
        name_slot: interval.name_slot,
        from: interval.from,
        to: interval.to,
        max_capacity: Number(interval.max_capacity),
        deleted_slots: deleted_intervals ? deleted_intervals.map(Number) : [],
        slot_type: "intervals",
      };

      console.log("API Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/hospital/v1/store-doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(
          result.msg || "An error occurred while updating the doctor intervals"
        );
      }
    }

    return true; // success
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const DeleteDocktorSlots = async ({
  token,
  doctor_id,
  specialization_id,
  deleted_slots,
  price,
}) => {
  const payload = {
    specialization_id: Number(specialization_id),
    price: Number(price),
    doctor_id: Number(doctor_id),
    deleted_slots: deleted_slots.map(Number),
  };

  try {
    const response = await fetch(`${API_URL}/hospital/v1/update-doctor-slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor slot"
      );
    }
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getSpecialization = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-booking/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch specializations data"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getBooking = async ({ token, id, start, end }) => {
  try {
    const queryParams = new URLSearchParams();
    if (start) queryParams.append("from_date", start);
    if (end) queryParams.append("to_date", end);
    const response = await fetch(
      `${API_URL}/hospital/v1/get-booking/${id}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Failed to fetch booking for that specialization data"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getAllBooking = async ({ token, start, end }) => {
  try {
    const queryParams = new URLSearchParams();
    if (start) queryParams.append("from_date", start);
    if (end) queryParams.append("to_date", end);
    const response = await fetch(
      `${API_URL}/hospital/v1/get-booking-for-all?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Failed to fetch booking for that specialization data"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getBookingDetails = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/get-one-booking/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getHomeVisit = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-home-visit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch home visit data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getAllHomeVists = async ({ token, start, end }) => {
  try {
    const queryParams = new URLSearchParams();
    if (start) queryParams.append("from_date", start);
    if (end) queryParams.append("to_date", end);
    const response = await fetch(
      `${API_URL}/hospital/v1/get-home-visit-for-all?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Failed to fetch HomeVists for that specialization data"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const updateHomeVisit = async ({
  token,
  home_visit_id,
  price,
  status,
}) => {
  const formdata = new FormData();
  formdata.append("home_visit_id", home_visit_id);

  if (status !== "rejected" && price) {
    formdata.append("price", price);
  }

  formdata.append("status", status);

  try {
    const response = await fetch(`${API_URL}/hospital/v1/update-home-visit`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateHomeStatus = async ({ token, home_visit_id, status }) => {
  const payload = {
    home_visit_id,
    status,
  };

  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/update-home-visit-status`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getRefunds = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-refund`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch refunds data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getWallet = async ({ token, start, end }) => {
  try {
    const queryParams = new URLSearchParams();
    if (start) queryParams.append("start", start);
    if (end) queryParams.append("end", end);

    const response = await fetch(
      `${API_URL}/hospital/v1/get-wallet?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getWalletTotal = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-wallet-total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while fetching wallet total"
      );
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getDoctorBooking = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/get-one-booking/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getBookingDoctor = async ({ token, id, date }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/get-booking/${id}?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch refunds data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getreviews = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/get-reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch reviews ");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getHomeVisitService = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/HomeVisitService`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch reviews ");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const assignAllVisitServices = async ({ token, services }) => {
  try {
    const formdata = new FormData();
    services.forEach((service, index) => {
      formdata.append(`services[${index}][id]`, service.id);
      formdata.append(`services[${index}][price]`, service.price);
    });

    const response = await fetch(
      `${API_URL}/hospital/v1/assignHomeVisitService`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while adding the Service"
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          "An error occurred while adding the Service"
      );
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const checkToken = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/hospital-check-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while checking the token"
      );
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getBookingsAttendance = async ({ token, id, date }) => {
  try {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append("date", date);
    const response = await fetch(
      `${API_URL}/hospital/v1/get-booking-by-doctor-id/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch booking for that doctor "
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const attendanceDoctor = async ({ token, doctor_id, date }) => {
  const formdata = new FormData();
  formdata.append("doctor_id", doctor_id);
  formdata.append("date", date);
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/update-doctor-attendance`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the attendance"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getDoctorSlots = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/doctor-slots/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch doctor slots");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const getDoctorsBook = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/get-doctor-by-hospital/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//home visist service
export const getHomeVisitServices = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/home-visit-services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch home visit services");
    }
  } catch (error) {
    throw error;
  }
};
export const UpdateHomeVisitServices = async ({
  token,
  hospital_id,
  service_id,
  price,
  name,
  type,
}) => {
  const formdata = new FormData();
  formdata.append("price", price);
  if (name) formdata.append("name", name);
  if (type) formdata.append("type", type);
  try {
    const response = await fetch(
      `${API_URL}/hospital/edit/${hospital_id}/home-visit-services/${service_id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the home visit service"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const UpdateHomeVisitServiceStatus = async ({
  token,
  service_id,
  status,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/home-visit-services/${service_id}/status/${status}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the service status"
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const rescheduleBooking = async ({
  token,
  booking_id,
  new_slot_id,
  new_date,
}) => {
  const payload = {
    booking_id: Number(booking_id),
    new_slot_id: Number(new_slot_id),
    new_date: new_date,
  };

  try {
    const response = await fetch(`${API_URL}/hospital/v1/reschedule-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while rescheduling the booking"
      );
    }

    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getEmployees = async ({ token, hospital_id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/employees?hospital_id=${hospital_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const createEmployee = async ({
  token,
  name,
  phone,
  email,
  password,
  role,
  hospital_id,
}) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/employees`, {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        email,
        password,
        role,
        hospital_id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while creating the employee"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateEmployee = async ({
  token,
  id,
  name,
  phone,
  email,
  password,
  role,
  hospital_id,
}) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/employees/${id}`, {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        email,
        password,
        role,
        hospital_id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the employee"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteEmployee = async ({ token, id, hospital_id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/employees/delete/${id}`,
      {
        method: "POST",
        body: JSON.stringify({
          hospital_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the employee"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Service interval slots

export const getServiceSlots = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/service-slots/get-all-by-service?hospital_service_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch service slots");
    }

    const data = await response.json();
    return data.data || data; // backend shape may be {data: ...}
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const createServiceIntervals = async ({
  token,
  service_id,
  intervals,
}) => {
  try {
    for (const interval of intervals) {
      const payload = {
        hospital_service_id: Number(service_id),
        date: interval.date,
        name_slot: interval.name_slot,
        from: interval.from,
        to: interval.to,
      };

      const response = await fetch(`${API_URL}/hospital/v1/service-slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.msg || result.message || "Failed to create service interval"
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateServiceIntervals = async ({
  token,
  service_id,
  intervals,
}) => {
  try {
    for (const interval of intervals) {
      if (!interval.id) continue;
      const payload = {
        hospital_service_id: Number(service_id),
        date: interval.date,
        name_slot: interval.name_slot,
        from: interval.from,
        to: interval.to,
      };

      const response = await fetch(
        `${API_URL}/hospital/v1/service-slots/update/${interval.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.msg || result.message || "Failed to update service interval"
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateServiceStatus = async ({ token, service_id }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/services/${service_id}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.msg || result.message || "Failed to update service status"
      );
    }
    return result.data || true;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getServiceBookings = async ({ token, serviceId }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/bookings/service/${serviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch service bookings");
    }

    const data = await response.json();

    // Handle response structure - backend now returns array
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.warn("Unexpected response structure:", data);
      return [];
    }
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const completeServiceBooking = async ({ token, bookingId }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/services-bookings/${bookingId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to complete booking");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const cancelServiceBooking = async ({ token, bookingId }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/services-bookings/${bookingId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to cancel booking");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Confirm doctor attendance
export const confirmDoctorAttendance = async ({ token, bookingId }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/confirm-doctor-attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to confirm doctor attendance"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Cancel doctor attendance
export const cancelDoctorAttendance = async ({ token, bookingId }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/cancel-doctor-attendance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to cancel doctor attendance"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Update role permissions
export const updateRolePermissions = async ({ token, roleId, permissions }) => {
  try {
    const response = await fetch(
      `${API_URL}/hospital/v1/employee-roles/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permissions: permissions,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update role permissions");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Approve booking (for past dates)
export const approveBooking = async ({ token, bookingId }) => {
  try {
    const response = await fetch(`${API_URL}/hospital/v1/approve-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_id: bookingId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve booking");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};
