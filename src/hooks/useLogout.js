import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context';

/**
 * Custom hook for user logout
 * Handle API call, local state cleanup, and redirect
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const { logout: contextLogout } = useAuth();

    return useMutation({
        mutationFn: async () => {
            return await authService.logout();
        },
        onSuccess: () => {
            // Clear context state
            contextLogout();
            // Redirect to login
            navigate('/');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Force logout on client side even if API fails
            contextLogout();
            navigate('/');
        },
    });
};

export default useLogout;
