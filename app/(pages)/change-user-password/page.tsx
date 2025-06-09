"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { resetPassword } from "../../api/auth/authApis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import HeaderBar from "@/components/partials/header";
 
const ChangePassword = () => {
    const router = useRouter()
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(6, "Password should be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await resetPassword({
          old_password: values.oldPassword,
          new_password: values.newPassword,
        });
        if (response?.status_code == 200) {
            router.push('/dashboard')
          toast.success(response?.message, { toastId: "change" });
          resetForm();
        } else {
          toast.error(response?.detail, { toastId: "change" });
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    },
  });

  const renderPasswordField = (
    name: "oldPassword" | "newPassword" | "confirmPassword",
    label: string,
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => (
    <TextField
      fullWidth
      variant="outlined"
      type={show ? "text" : "password"}
      label={label}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      margin="normal"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow(!show)}
              edge="end"
              aria-label={`toggle ${label.toLowerCase()} visibility`}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <>
    <HeaderBar />
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
    >
      <h2>Change Password</h2>
      <form onSubmit={formik.handleSubmit}>
        {renderPasswordField(
          "oldPassword",
          "Current Password",
          showOldPass,
          setShowOldPass
        )}
        {renderPasswordField(
          "newPassword",
          "New Password",
          showNewPass,
          setShowNewPass
        )}
        {renderPasswordField(
          "confirmPassword",
          "Confirm New Password",
          showConfirmPass,
          setShowConfirmPass
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !formik.isValid || !formik.dirty}
          sx={{ mt: 2 }}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </Box>
    </>
  );
};

export default ChangePassword;
