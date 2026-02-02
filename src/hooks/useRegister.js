import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Custom hook for user registration
 * Uses React Query's useMutation for state management
 * 
 * @returns {Object} Mutation object with mutate, isPending, isError, error, isSuccess, data
 */
export const useRegister = () => {
    return useMutation({
        mutationFn: async (userData) => {
            return await authService.register(userData);
        },
        onSuccess: (data) => {
            console.log('Registration successful:', data);
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });
};

export default useRegister;
