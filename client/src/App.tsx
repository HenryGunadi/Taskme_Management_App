import {Routes, Route, Navigate, useActionData, useLocation} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {useAuth} from './auth/Authentication';

function App() {
	const location = useLocation();
	if (location.pathname !== '/register') {
		useAuth();
	}

	return (
		<div className="w-screen font-Nunito h-screen">
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/main/*" element={<Dashboard />} />
			</Routes>
		</div>
	);
}

export default App;
