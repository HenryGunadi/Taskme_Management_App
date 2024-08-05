import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {useAuth} from './auth/Authentication';
import ForgotPass from './components/ForgotPass';
import OTP from './components/OTP';

type unProtectedRouteType = {
	page: string;
	link: string;
};

function App() {
	const unProtectedRoutes: unProtectedRouteType[] = [
		{
			page: 'register',
			link: '/register',
		},
		{
			page: 'forgotPassword',
			link: '/forgotPassword',
		},
		{
			page: 'OTP',
			link: '/OTP',
		},
	];

	const location = useLocation();
	const isUnprotectedRoute = unProtectedRoutes.some((route: unProtectedRouteType) => route.link === location.pathname);

	if (!isUnprotectedRoute) {
		useAuth();
	}

	return (
		<div className="w-screen h-screen overflow-x-hidden">
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgotPassword" element={<ForgotPass />} />
				<Route path="/OTP" element={<OTP />} />
				<Route path="/main/*" element={<Dashboard />} />
			</Routes>
		</div>
	);
}

export default App;
