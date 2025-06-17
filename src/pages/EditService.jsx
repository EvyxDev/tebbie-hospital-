import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeVisitServices, UpdateHomeVisitServices } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const EditService = () => {
  const hospital_id = localStorage.getItem("hospital_id");
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [editingServiceId, setEditingServiceId] = useState(null);

  const {
    data: homevisitservices,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["home-visit-services"],
    queryFn: () => getHomeVisitServices({ token, id: hospital_id }),
  });

  const mutation = useMutation({
    mutationFn: UpdateHomeVisitServices,
    onSuccess: () => {
      queryClient.invalidateQueries(["home-visit-services"]);
      setEditingServiceId(null);
    },
    onError: (error) => {
      console.error("Update failed:", error);
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

  const validationSchema = Yup.object().shape({
    price: Yup.number()
      .required("السعر مطلوب")
      .min(0, "يجب أن يكون السعر موجبًا")
      .typeError("يجب أن يكون السعر رقمًا"),
  });

  return (
    <section className="h-full flex flex-col my-8 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">تعديل سعر خدمات الزيارة المنزلية</h2>
      <div className="space-y-4">
        {homevisitservices.map((service) => (
          <div key={service.id} className="flex flex-col border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-md font-medium">{service.name}</span>
              {editingServiceId !== service.id ? (
                <div className="flex items-center gap-2 text-md">
                  <span>{parseFloat(service.price).toFixed(2)}د.ل</span>
                  <button
                    onClick={() => setEditingServiceId(service.id)}
                    className="text-[#3AAB95] hover:underline"
                  >
                    تعديل
                  </button>
                </div>
              ) : (
                <Formik
                  initialValues={{ price: parseFloat(service.price) || 0 }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    mutation.mutate({
                      token,
                      hospital_id,
                      service_id: service.id,
                      price: values.price.toString(),
                    });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <Field
                          type="number"
                          name="price"
                          className="border rounded p-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#3AAB95]"
                        />
                        {errors.price && touched.price && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.price}
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="px-3 py-1  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-md  w-auto "
                      >
                        {mutation.isPending ? "جارٍ التعديل..." : "تعديل"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        إلغاء
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditService;