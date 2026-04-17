import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth, useCart } from '../context';

/**
 * Custom hook for user logout
 * Handle API call, local state cleanup, and redirect
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const { logout: contextLogout } = useAuth();
    const { clearCart } = useCart();

    const handleLogoutSuccess = () => {
        // Clear sensitive data first (like cart)
        try {
            clearCart();
        } catch (e) {
            console.error('Failed to clear cart:', e);
        }

        // Navigate to public home page immediately using replace to avoid history stack issues
        // We do this BEFORE clearing auth state to prevent ProtectedRoute from redirecting to /login
        navigate('/', { replace: true });

        // Clear auth state after a short delay to allow navigation to complete
        // This prevents the "flash" of the login screen
        setTimeout(() => {
            contextLogout();
        }, 50);
    }

    return useMutation({
        mutationFn: async () => {
            return await authService.logout();
        },
        onSuccess: () => {
            handleLogoutSuccess();
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Force logout on client side even if API fails
            handleLogoutSuccess();
        },
    });
};

export default useLogout;
