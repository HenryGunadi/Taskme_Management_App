import {jwtDecode} from 'jwt-decode';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

export const isTokenExpired = (token: string): boolean => {
	const {exp} = jwtDecode(token);
	if (exp && Date.now() >= exp * 1000) {
		return true;
	}

	return false;
};

export const handleLogout = (navigate: any) => {
	navigate('/login');
};

export const useAuth = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token || isTokenExpired(token)) {
			handleLogout(navigate);
		}

		if (token) {
			if (location.pathname === '/login') {
				localStorage.removeItem('token');
			}
		}
	}, [location.pathname, token, navigate]);
};
