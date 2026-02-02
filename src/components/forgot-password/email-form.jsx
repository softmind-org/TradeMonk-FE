import React from "react";
import { Button, Input, Card } from "@components/ui";
import { forgotPasswordEmailSchema } from '@/schemas/auth-schema'
import { useFormik } from "formik";
import { Mail } from "lucide-react";

const EmailForm = ({ onSubmit, isLoading, error, onBack }) => {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordEmailSchema,
    onSubmit: (values) => {
      onSubmit(values.email);
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
            Forgot Password
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your email address to receive a verification code
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* API Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error?.response?.data?.message || 'Failed to send OTP. Please try again.'}
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full py-4 text-base font-semibold bg-transparent border border-white/10 text-white hover:bg-white/5"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-base font-semibold text-[#0B1220]"
              variant="secondary"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmailForm;
