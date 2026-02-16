const getMedicalStatus = () => {
  const is_medical_service = localStorage.getItem("is_medical_service");
  return is_medical_service;
};

export default getMedicalStatus;
