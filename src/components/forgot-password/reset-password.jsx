
import React from "react";
import { useFormik } from "formik";
import { Button, InputPassword, Card } from "@components/ui";
import { resetPasswordSchema } from '@/schemas/auth-schema'
import { LockKeyhole } from "lucide-react";

const ResetPassword = ({ onSubmit, isLoading, error }) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="bg-card border border-border p-8 md:p-10 relative overflow-hidden w-full max-w-lg">
        {/* Top Gradient Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 240, 255, 0) 0%, rgba(212, 160, 23, 0.5) 50%, rgba(0, 240, 255, 0) 100%)",
          }}
        />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-muted-foreground text-sm">
            Create a new strong password for your account
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* API Error Message */}
           {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error?.response?.data?.message || 'Failed to reset password. Please try again.'}
            </div>
          )}
          
          <InputPassword
            label="New Password"
            name="password"
            placeholder="Enter new password"
            icon={LockKeyhole}
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          <InputPassword
            label="Confirm Password"
            name="confirm_password"
            placeholder="Confirm new password"
            icon={LockKeyhole}
            required
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirm_password && formik.errors.confirm_password}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-base font-semibold text-[#0B1220]"
            variant="secondary"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
