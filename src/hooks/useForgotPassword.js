import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Custom hook for forgot password (sending OTP)
 */
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (email) => {
            return await authService.forgotPassword(email);
        },
        onSuccess: (data) => {
            console.log('OTP sent successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to send OTP:', error);
        },
    });
};

export default useForgotPassword;
