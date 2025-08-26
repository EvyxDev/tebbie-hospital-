export const getSpecializationById = (specializationsData, id) => {
  return specializationsData.find((specialization) => specialization.id === id);
};
