import { ClearAuthToken } from '../api/api';

export const clearAuthSession = () => {
	localStorage.removeItem('auth_access_token');
	localStorage.removeItem('username');
	localStorage.removeItem('hashed_id');
	localStorage.removeItem('role');
	localStorage.removeItem('position');
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

