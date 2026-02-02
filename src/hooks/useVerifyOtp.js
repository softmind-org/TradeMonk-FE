import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Custom hook for verifying OTP
 */
export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async (data) => {
            return await authService.verifyOTP(data);
        },
        onSuccess: (data) => {
            console.log('OTP verified successfully:', data);
        },
        onError: (error) => {
            console.error('OTP verification failed:', error);
        },
    });
};

export default useVerifyOtp;