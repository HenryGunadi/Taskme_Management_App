import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

export const isTokenExpired = (token: string): boolean => {
	if (!token) return true;
	const {exp} = jwtDecode(token);
	if (exp && Date.now() >= exp * 1000) {
		return true;
	}

	return false;
};

export const handleLogout = (navigate: any) => {
	localStorage.removeItem('token');
	navigate('/login');
};

export const useAuth = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token || isTokenExpired(token)) {
			handleLogout(navigate);
		}
	}, [navigate, token]);
};
