import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHomeVisitServices,
  UpdateHomeVisitServiceStatus,
} from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { Switch, FormControlLabel } from "@mui/material";

const EditService = () => {
  const hospital_id = localStorage.getItem("hospital_id");
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const {
    data: homevisitservices,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["home-visit-services"],
    queryFn: () => getHomeVisitServices({ token, id: hospital_id }),
  });

  const statusMutation = useMutation({
    mutationFn: UpdateHomeVisitServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["home-visit-services"]);
    },
    onError: (error) => {
      console.error("Status update failed:", error);
    },
  });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p>{error.message}</p>
      </div>
    );
  }

  const handleStatusToggle = (serviceId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    statusMutation.mutate({
      token,
      service_id: serviceId,
      status: newStatus,
    });
  };

  return (
    <section className="h-full flex flex-col my-8 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">
        إدارة حالة خدمات الزيارة المنزلية
      </h2>
      <div className="space-y-4">
        {homevisitservices.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center border-b pb-4"
          >
            <div className="flex flex-col">
              <span className="text-md font-medium">{service.name}</span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>السعر: {parseFloat(service.price).toFixed(2)}د.ل</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FormControlLabel
                control={
                  <Switch
                    checked={service.status === "active"}
                    onChange={() =>
                      handleStatusToggle(service.id, service.status)
                    }
                    disabled={statusMutation.isPending}
                    color="primary"
                  />
                }
                labelPlacement="start"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditService;
