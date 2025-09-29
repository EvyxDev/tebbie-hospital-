/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { getEmployeeRoles } from "../utlis/https";

const RoleSelect = ({
  value,
  onChange,
  label = "اختر الدور",
  disabled = false,
  required = false,
}) => {
  const token = localStorage.getItem("authToken");
  const [selectedRole, setSelectedRole] = useState(value || "");

  // Fetch employee roles using the same pattern as your other queries
  const {
    data: rolesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee-roles"],
    queryFn: () => getEmployeeRoles({ token }),
  });

  const roles = rolesData?.data || [];

  useEffect(() => {
    if (value !== selectedRole) {
      setSelectedRole(value || "");
    }
  }, [value]);

  const handleChange = (event) => {
    const roleName = event.target.value;
    setSelectedRole(roleName);
    onChange?.(roleName);
  };

  // Get the display name for the selected role
  const getDisplayName = (roleName) => {
    const role = roles.find((r) => r.name === roleName);
    return role?.display_name || roleName || "";
  };

  if (isLoading) {
    return (
      <Box>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            value=""
            disabled
            sx={{
              direction: "rtl",
              "& .MuiSelect-select": {
                textAlign: "right",
                direction: "rtl",
              },
            }}
          >
            <MenuItem value="">
              <em>جاري التحميل...</em>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            value=""
            disabled
            sx={{
              direction: "rtl",
              "& .MuiSelect-select": {
                textAlign: "right",
                direction: "rtl",
              },
            }}
          >
            <MenuItem value="">
              <em>خطأ في تحميل الأدوار</em>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="role-select-label">{label}</InputLabel>
        <Select
          labelId="role-select-label"
          value={selectedRole}
          onChange={handleChange}
          label={label}
          disabled={disabled}
          required={required}
          renderValue={(value) => getDisplayName(value)}
          sx={{
            direction: "rtl",
            "& .MuiSelect-select": {
              textAlign: "right",
              direction: "rtl",
            },
          }}
        >
          <MenuItem value="">
            <em>اختر دور</em>
          </MenuItem>
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.name}>
              {role.display_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoleSelect;
