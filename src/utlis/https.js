const API_URL = import.meta.env.VITE_APP_API_URL;

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
        throw new Error(errorData.message || "Failed to fetch specializations data");
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
  export const getNotifications = async ({ token }) => {
    try {
      const response = await fetch(`${API_URL}/hospital/v1/notification-hospital`, {
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
  export const assignSpecialization = async ({
    token,
    specialization_id,
    price,
    visit_time,
    slots, 
  }) => {
    const formdata = new FormData();
    formdata.append("specialization_id", specialization_id);
    formdata.append("price", price);
    formdata.append("visit_time", visit_time);
  
    slots.forEach((slot, index) => {
      formdata.append(`slots[${index}][doctor_id]`, slot.doctor_id);
      formdata.append(`slots[${index}][day_id]`, slot.day_id);
      formdata.append(`slots[${index}][start_time]`, slot.start_time);
      formdata.append(`slots[${index}][end_time]`, slot.end_time);
    });
  
    try {
      const response = await fetch(`${API_URL}/hospital/v1/assignSpecializations`, {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.msg || "An error occurred while updating the Hospital");
      }
  
      return result.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
 export const getSpecialization = async ({ token ,id }) => {
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
        throw new Error(errorData.message || "Failed to fetch specializations data");
      }
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  };
  export const getBooking = async ({ token , id }) => {
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
        throw new Error(errorData.message || "Failed to fetch booking for that specialization data");
      }
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  };
  export const getBookingDetails = async ({ token ,id}) => {
    try {
      const response = await fetch(`${API_URL}/hospital/v1/get-one-booking/${id}`, {
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
      return data.data;
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  };
  
  export const updateHomeVisit = async ({ token, home_visit_id, price, status }) => {
    const formdata = new FormData();
    formdata.append("home_visit_id", home_visit_id);
  
    if (status !== "rejected") {
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
        throw new Error(result.msg || "An error occurred while updating the Hospital");
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
  export const getWallet = async ({ token }) => {
    try {
      const response = await fetch(`${API_URL}/hospital/v1/get-wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.msg || "An error occurred while updating the Hospital");
      }
  
      return result.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  export const getDoctorBooking = async ({ token ,id}) => {
    try {
      const response = await fetch(`${API_URL}/hospital/v1/get-one-booking/${id}`, {
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
  export const getBookingDoctor = async ({ token ,id ,date }) => {
    try {
      const response = await fetch(`${API_URL}/hospital/v1/get-booking/${id}?date=${date}`, {
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