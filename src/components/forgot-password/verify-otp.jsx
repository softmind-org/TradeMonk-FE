import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Button, Card } from "@components/ui"; 
import { verifyOTPSchema } from '@/schemas/auth-schema'

const OTP_LENGTH = 6;

const VerifyOTP = ({ onSubmit, onBack, email, isLoading, error, onResend }) => {
  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verifyOTPSchema,
    onSubmit: (values) => {
      onSubmit(values.otp);
    },
  });

  const otpChars = useMemo(() => {
    const v = (formik.values.otp || "").slice(0, OTP_LENGTH);
    return Array.from({ length: OTP_LENGTH }, (_, i) => v[i] || "");
  }, [formik.values.otp]);

  const setAtIndex = (idx, char) => {
    const current = (formik.values.otp || "").slice(0, OTP_LENGTH).split("");
    while (current.length < OTP_LENGTH) current.push("");
    current[idx] = char;
    const nextOtp = current.join("").replace(/\s/g, "");
    formik.setFieldValue("otp", nextOtp);
  };

  const focusIndex = (idx) => {
    const el = document.getElementById(`otp-${idx}`);
    el?.focus();
    el?.select?.();
  };

  const handleChange = (idx, e) => {
    const raw = e.target.value || "";
    const digit = raw.replace(/\D/g, "").slice(-1); // only last digit
    setAtIndex(idx, digit);

    if (digit && idx < OTP_LENGTH - 1) focusIndex(idx + 1);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (otpChars[idx]) {
        setAtIndex(idx, "");
        return;
      }
      if (idx > 0) focusIndex(idx - 1);
    }
    if (e.key === "ArrowLeft" && idx > 0) focusIndex(idx - 1);
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) focusIndex(idx + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    formik.setFieldValue("otp", pasted);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Matched Card styling from Login.jsx */}
      <Card className="bg-card border border-border p-8 md:p-10 relative overflow-hidden w-full max-w-lg">
        {/* Top Gradient Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0) 0%, rgba(212, 160, 23, 0.5) 50%, rgba(0, 240, 255, 0) 100%)'
          }}
        />

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Verify Your OTP
          </h2>
          <p className="text-muted-foreground text-sm">
            Please enter the OTP to verify your account. A code has been sent to{" "}
            <span className="text-secondary font-medium">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* API Error Message */}
           {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error?.response?.data?.message || 'Invalid OTP. Please try again.'}
            </div>
          )}

          {/* Label */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-white mb-0.5">
              Enter OTP <span className="text-red-500 ml-1">*</span>
            </label>

            {/* OTP Boxes */}
            <div className="flex flex-wrap gap-2 justify-between" onPaste={handlePaste}>
              {otpChars.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(idx, e)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onBlur={() => formik.setFieldTouched("otp", true)}
                  disabled={isLoading}
                  className="h-12 w-12 rounded-lg border border-white/10 bg-[#0B1220]/50 text-center
                             text-lg text-white outline-none transition-all duration-200
                             focus:border-secondary focus:ring-1 focus:ring-secondary disabled:opacity-50"
                />
              ))}
            </div>

            {/* Error */}
            {formik.touched.otp && formik.errors.otp && (
              <span className="text-sm text-red-500 mt-0.5">{formik.errors.otp}</span>
            )}

            {/* Resend */}
            <div className="mt-2 text-sm text-muted-foreground text-right">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                className="text-secondary hover:text-secondary/80 font-medium hover:underline transition-colors"
                onClick={onResend}
                disabled={isLoading}
              >
                Resend
              </button>
            </div>
          </div>

          {/* Buttons */}
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
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VerifyOTP;
