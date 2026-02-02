import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Custom hook for user login
 * Uses React Query's useMutation for state management
 * 
 * @returns {Object} Mutation object with mutate, isPending, isError, error, isSuccess, data
 */
export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            return await authService.login(credentials);
        },
        onSuccess: (data) => {
            console.log('Login successful:', data);
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
};

export default useLogin;
