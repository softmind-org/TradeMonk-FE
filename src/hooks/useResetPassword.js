import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Custom hook for resetting password
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (data) => {
            return await authService.resetPassword(data);
        },
        onSuccess: (data) => {
            console.log('Password reset successfully:', data);
        },
        onError: (error) => {
            console.error('Password reset failed:', error);
        },
    });
};

export default useResetPassword;
