/**
 * Forgot Password Flow
 * Multi-step process: Email → OTP → Reset Password → Success
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailForm,
  SuccessScreen,
  VerifyOTP,
  ResetPassword,
} from "@components/forgot-password";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useResetPassword } from "@/hooks/useResetPassword";

const ForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Hooks
  const { mutate: sendOtp, isPending: isSendingOtp, error: sendOtpError } = useForgotPassword();
  const { mutate: verifyOtpMutate, isPending: isVerifyingOtp, error: verifyOtpError } = useVerifyOtp();
  const { mutate: resetPasswordMutate, isPending: isResettingPassword, error: resetPasswordError } = useResetPassword();

  const next = () => setStep((prev) => prev + 1);
  const back = () => {
    if (step === 1) {
      navigate("/login");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // Step 1: Handle Email Submission
  const handleEmailSubmit = (emailValue) => {
    setEmail(emailValue);
    sendOtp({ email: emailValue }, {
      onSuccess: () => {
        next();
      }
    });
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = (otpValue) => {
    setOtp(otpValue);
    verifyOtpMutate({ email, otp: otpValue }, {
      onSuccess: () => {
        next();
      }
    });
  };

  // Step 3: Handle Password Reset
  const handleResetPassword = (values) => {
    resetPasswordMutate({
      email,
      otp,
      newPassword: values.password,
      confirmPassword: values.confirm_password
    }, {
      onSuccess: () => {
        next();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {step === 1 && (
        <EmailForm 
          onSubmit={handleEmailSubmit} 
          isLoading={isSendingOtp}
          error={sendOtpError}
          onBack={back} 
        />
      )}
      {step === 2 && (
        <VerifyOTP 
          onSubmit={handleVerifyOtp}
          isLoading={isVerifyingOtp}
          error={verifyOtpError}
          onBack={back} 
          email={email} 
          onResend={() => sendOtp({ email })}
        />
      )}
      {step === 3 && (
        <ResetPassword 
          onSubmit={handleResetPassword}
          isLoading={isResettingPassword}
          error={resetPasswordError}
        />
      )}
      {step === 4 && <SuccessScreen />}
    </div>
  );
};

export default ForgotPasswordFlow;
