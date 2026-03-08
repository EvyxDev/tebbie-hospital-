import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { CustomTimeField } from "../components/CustomTimePicker";
import {
  getServiceSlots,
  createServiceIntervals,
  updateServiceStatus,
  getAllServices,
  updateServiceIntervals,
} from "../utlis/https";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export default function ServiceSlots() {
  const token = localStorage.getItem("authToken");
  const { serviceId } = useParams();
  const queryClient = useQueryClient();

  const { data: serviceSlotsData, isLoading } = useQuery({
    queryKey: ["service-intervals", serviceId],
    queryFn: () => getServiceSlots({ token, id: serviceId }),
    enabled: !!serviceId,
  });
  const { data: allServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServices({ token }),
    enabled: !!token,
    staleTime: 60_000,
  });
  const currentService = useMemo(() => {
    if (!allServices || !serviceId) return null;
    return allServices.find((s) => String(s.id) === String(serviceId));
  }, [allServices, serviceId]);
  const [intervals, setIntervals] = useState([]);
  const [newIntervals, setNewIntervals] = useState([]);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIntervalId, setEditingIntervalId] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (serviceSlotsData) {
      let currentIntervals = [];

      // Check if serviceSlotsData has intervals property
      if (
        serviceSlotsData.intervals &&
        Array.isArray(serviceSlotsData.intervals)
      ) {
        currentIntervals = serviceSlotsData.intervals;
      }
      // Check if serviceSlotsData itself is an array
      else if (Array.isArray(serviceSlotsData)) {
        currentIntervals = serviceSlotsData;
      }
      // If it's a single object, wrap it in an array
      else if (typeof serviceSlotsData === "object" && serviceSlotsData.id) {
        currentIntervals = [serviceSlotsData];
      }

      setIntervals(currentIntervals);
    }
  }, [serviceSlotsData]);

  const createMutation = useMutation({
    mutationFn: createServiceIntervals,
    onSuccess: () => {
      queryClient.invalidateQueries(["service-intervals", serviceId]);
      setNewIntervals([]);
      alert("تم حفظ الفترات بنجاح");
    },
    onError: () => alert("تاكد من ادخال جميع البيانات بشكل صحيح"),
  });

  const updateIntervalsMutation = useMutation({
    mutationFn: updateServiceIntervals,
    onSuccess: () => {
      queryClient.invalidateQueries(["service-intervals", serviceId]);
      setEditingIntervalId(null);
    },
    onError: () => alert("فشل تعديل الفترة"),
  });

  const statusMutation = useMutation({
    mutationFn: updateServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      alert("تم تحديث حالة الخدمة بنجاح");
    },
    onError: () => alert("فشل تحديث حالة الخدمة"),
  });

  const handleAddInterval = (values) => {
    if (values.from_date && values.from_date < today) {
      alert("تاريخ بداية الفترة لا يمكن أن يكون في الماضي");
      return;
    }
    if (values.to_date && values.to_date < today) {
      alert("تاريخ نهاية الفترة لا يمكن أن يكون في الماضي");
      return;
    }
    if (
      values.from_date &&
      values.to_date &&
      values.from_date > values.to_date
    ) {
      alert("تاريخ بداية الفترة لا يمكن أن يكون أكبر من تاريخ نهاية الفترة");
      return;
    }
    if (values.from && values.to && values.from > values.to) {
      alert("وقت بداية الفترة لا يمكن أن يكون أكبر من وقت نهاية الفترة");
      return;
    }

    const newInterval = {
      from_date: values.from_date,
      to_date: values.to_date,
      name_slot: values.name_slot,
      from: values.from,
      to: values.to,
      relatable_id: Number(serviceId),
    };
    setNewIntervals((prev) => [...prev, newInterval]);
    setTimeIsModalOpen(false);
  };
  const handleRemoveNew = (indexToRemove) => {
    if (Array.isArray(newIntervals)) {
      setNewIntervals((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
  };

  const handleSubmit = () => {
    if (newIntervals.length > 0) {
      createMutation.mutate({
        token,
        service_id: serviceId,
        intervals: newIntervals,
      });
    }
  };

  const handleServiceStatusToggle = () => {
    if (!currentService) return;
    const newStatus =
      currentService.status === "active" ? "inactive" : "active";
    statusMutation.mutate({
      token,
      service_id: currentService.id,
      status: newStatus,
    });
  };

  // Editing handled via the same modal as creation

  const convertTo12Hour = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG");
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  if (isLoading)
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          جاري التحميل...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ maxHeight: "100vh", overflow: "auto", width: "100%", p: 3 }}>
      <Formik
        initialValues={{
          from_date: "",
          to_date: "",
          date: "",
          name_slot: "",
          from: "",
          to: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            {/* Service Header */}
            <Card
              elevation={3}
              sx={{
                mb: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  {currentService?.name || `خدمة رقم #${serviceId}`}
                </Typography>
                {currentService?.total_price && (
                  <Typography sx={{ textAlign: "center", mt: 0.5 }}>
                    السعر: {currentService.total_price}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Chip
                    label={
                      currentService?.status === "active"
                        ? "الخدمة نشطة"
                        : "الخدمة غير نشطة"
                    }
                    color={
                      currentService?.status === "active"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                  <Switch
                    checked={currentService?.status === "active"}
                    onChange={handleServiceStatusToggle}
                    color="success"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Current Intervals */}
            {Array.isArray(intervals) && intervals.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}
                >
                  الفترات الحالية
                </Typography>
                <Stack spacing={2}>
                  {intervals.map((interval, index) => (
                    <Card
                      key={interval.id || index}
                      elevation={2}
                      sx={{
                        borderLeft: "4px solid",
                        borderLeftColor: "primary.main",
                        "&:hover": { elevation: 4 },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "primary.main", fontWeight: "bold" }}
                          >
                            {interval.name_slot}
                          </Typography>
                          <Box>
                            {interval.id && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setIsEditing(true);
                                  setEditingIntervalId(interval.id);
                                  setFieldValue("date", interval.date || "");
                                  setFieldValue(
                                    "name_slot",
                                    interval.name_slot || "",
                                  );
                                  setFieldValue(
                                    "from",
                                    (interval.from || "").slice(0, 5),
                                  );
                                  setFieldValue(
                                    "to",
                                    (interval.to || "").slice(0, 5),
                                  );
                                  setTimeIsModalOpen(true);
                                }}
                              >
                                تعديل
                              </Button>
                            )}
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                📅 <strong>التاريخ:</strong>{" "}
                                {formatDate(interval.date)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Typography variant="body2" color="text.secondary">
                              🕘 <strong>من:</strong>{" "}
                              {convertTo12Hour(interval.from)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Typography variant="body2" color="text.secondary">
                              🕙 <strong>إلى:</strong>{" "}
                              {convertTo12Hour(interval.to)}
                            </Typography>
                          </Grid>
                        </Grid>

                        {/* inline edit removed - using modal */}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* New Intervals */}
            {Array.isArray(newIntervals) && newIntervals.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "success.main", fontWeight: "bold" }}
                >
                  الفترات الجديدة
                </Typography>
                <Stack spacing={2}>
                  {newIntervals.map((interval, index) => (
                    <Card
                      key={index}
                      elevation={2}
                      sx={{
                        borderLeft: "4px solid",
                        borderLeftColor: "success.main",
                        bgcolor: "success.50",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "success.main", fontWeight: "bold" }}
                          >
                            {interval.name_slot}
                            <Chip
                              label="جديد"
                              color="success"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveNew(index)}
                            color="error"
                            size="small"
                          >
                            ❌
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              📅 <strong>من تاريخ:</strong>{" "}
                              {formatDate(interval.from_date)}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="mt-2"
                              color="text.secondary"
                            >
                              📅 <strong>إلى تاريخ:</strong>{" "}
                              {formatDate(interval.to_date)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              🕘 <strong>من:</strong>{" "}
                              {convertTo12Hour(interval.from)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              🕙 <strong>إلى:</strong>{" "}
                              {convertTo12Hour(interval.to)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Add New Interval Button */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: "2px dashed",
                borderColor: "grey.300",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => {
                setIsEditing(false);
                setEditingIntervalId(null);
                setFieldValue("date", "");
                setFieldValue("from_date", "");
                setFieldValue("to_date", "");
                setFieldValue("name_slot", "");
                setFieldValue("from", "");
                setFieldValue("to", "");
                setFieldValue("max_capacity", "");
                setTimeIsModalOpen(true);
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <IoIosAdd size={30} />
                  <Typography variant="body1" color="text.secondary">
                    إضافة فترة جديدة
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={newIntervals.length === 0}
              fullWidth
              variant="contained"
              size="large"
              sx={{
                background:
                  newIntervals.length > 0
                    ? "linear-gradient(135deg, #33A9C7 0%, #3AAB95 100%)"
                    : "grey.300",
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": {
                  background:
                    newIntervals.length > 0
                      ? "linear-gradient(135deg, #2a8ba3 0%, #2e8a6b 100%)"
                      : "grey.400",
                },
              }}
            >
              💾 حفظ الفترات ({newIntervals.length})
            </Button>

            {/* Modal */}
            <AnimatePresence>
              {isTimeModalOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto"
                  onClick={() => setTimeIsModalOpen(false)}
                >
                  <motion.div
                    className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] relative z-50 overflow-y-auto"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(event, info) => {
                      if (info?.offset?.y && info.offset.y > 150) {
                        setTimeIsModalOpen(false);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
                    <h2 className="text-lg font-medium text-center mb-4">
                      {isEditing ? "تعديل الفترة" : "إضافة فترة جديدة"}
                    </h2>

                    <div className="mb-4">
                      {isEditing && (
                        <>
                          {" "}
                          <label className="block my-2 font-semibold">
                            التاريخ
                          </label>
                          <Field
                            type="date"
                            name="date"
                            value={values.date}
                            onChange={(e) =>
                              setFieldValue("date", e.target.value)
                            }
                            className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                          />
                        </>
                      )}
                      {!isEditing && (
                        <>
                          <label className="block my-2 font-semibold">
                            تاريخ بداية الفترة
                          </label>
                          <Field
                            type="date"
                            name="from_date"
                            min={today}
                            value={values.from_date}
                            onChange={(e) =>
                              setFieldValue("from_date", e.target.value)
                            }
                            className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                          />
                          <label className="block my-2 font-semibold">
                            تاريخ نهاية الفترة
                          </label>
                          <Field
                            type="date"
                            name="to_date"
                            value={values.to_date}
                            onChange={(e) =>
                              setFieldValue("to_date", e.target.value)
                            }
                            className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                          />
                        </>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block my-2 font-semibold">
                        اسم الفترة
                      </label>
                      <Field
                        type="text"
                        name="name_slot"
                        value={values.name_slot}
                        onChange={(e) =>
                          setFieldValue("name_slot", e.target.value)
                        }
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        placeholder="مثال: فترة صباحية"
                      />
                    </div>

                    <div className="flex gap-4 mb-4">
                      <div className="w-full">
                        <label className="block my-2 font-semibold">
                          بداية من
                        </label>
                        <CustomTimeField
                          type="time"
                          name="from"
                          value={values.from}
                          onChange={(val) => setFieldValue("from", val)}
                          className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block my-2 font-semibold">
                          ينتهى فى
                        </label>
                        <CustomTimeField
                          type="time"
                          name="to"
                          value={values.to}
                          onChange={(val) => setFieldValue("to", val)}
                          className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing && editingIntervalId) {
                          updateIntervalsMutation.mutate({
                            token,
                            service_id: serviceId,
                            intervals: [
                              {
                                id: editingIntervalId,
                                name_slot: values.name_slot,
                                from_date: values.from_date,
                                to_date: values.to_date,
                                from: values.from,
                                to: values.to,
                              },
                            ],
                          });
                          setTimeIsModalOpen(false);
                        } else {
                          const intervalValues = {
                            date: values.date,
                            name_slot: values.name_slot,
                            from_date: values.from_date,
                            to_date: values.to_date,
                            from: values.from,
                            to: values.to,
                          };
                          handleAddInterval(intervalValues);
                        }
                      }}
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg mb-32 rounded-tr-lg w-full"
                    >
                      {isEditing ? "حفظ التعديل" : "حفظ الفترة"}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
