import { useMutation } from "@tanstack/react-query";
import { Formik, Field, Form, FieldArray } from "formik";
import { assignAllVisitServices } from "../utlis/https";
import { useState } from "react";

const PhysiotherapyPrice = ({ data }) => {
  const token = localStorage.getItem("authToken");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: assignAllVisitServices,
    onSuccess: (response) => {
      setError(false);

      console.log("Specialization assigned successfully:", response);
      alert("تم حفظ التخصص بنجاح");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (values) => {
    const dataToSubmit = {
      token,
      services: values.services.map((service) => ({
        id: service.id,
        price: parseFloat(service.price),
      })),
    };

    mutation.mutate(dataToSubmit);
  };

  return (
    <section>
      <Formik
        initialValues={{
          services: [{ id: "", price: "" }],
        }}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="services">
              {({ push, remove }) => (
                <>
                  {values.services.map((service, index) => (
                    <div key={index} className="service-entry">
                      <Field
                        as="select"
                        name={`services[${index}].id`}
                        className="border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                      >
                                                <option value="">الخدمات</option>

                        {data.length > 0 ? (
                          data?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option>عذرا لا توجد خدمات لعرضها</option>
                        )}
                      </Field>
                      <Field
                        name={`services[${index}].price`}
                        placeholder="السعر"
                        className="border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-4"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-500 text-white  py-3 px-4 rounded-bl-lg rounded-tr-lg w-full my-4"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ id: "", price: "" })}
                    className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
                  >
                    اضافة خدمه جديده
                  </button>
                </>
              )}
            </FieldArray>
            <div className="my-4">
              <button
                type="submit"
                className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
              >
                حفظ
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <p className="text-xl text-red-500">{error && <span>{error}</span>}</p>
    </section>
  );
};

export default PhysiotherapyPrice;
