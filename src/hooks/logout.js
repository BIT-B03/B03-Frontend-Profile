import { ClearAuthToken } from '../api/api';

export const clearAuthSession = () => {
	localStorage.removeItem('auth_access_token');
	localStorage.removeItem('username');
	ClearAuthToken();
};

export const logoutAndRedirect = ({
	navigate,
	onClose,
	to = '/login',
	replace = true,
} = {}) => {
	clearAuthSession();
	onClose?.();

	if (typeof navigate === 'function') {
		navigate(to, { replace });
	}
};

