import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {LoginUserPayload} from './Types';
import {Alert, LinearProgress} from '@mui/material';

export const backendUrl: string = 'http://localhost:8080/api/v1';

const Login: React.FC = () => {
	// React Router
	const navigate = useNavigate();
	const navigateToRegister = () => {
		navigate(`/register`);
	};
	const navigateToHome = () => {
		navigate(`/dashboard`);
	};

	const [isLoginFailed, setIsLoginFailed] = useState<boolean | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [loginPayload, setLoginPayload] = useState<LoginUserPayload>({
		email: '',
		password: '',
	});

	const handleAlert = () => {
		setIsLoginFailed(null);
	};

	// handle login form
	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post(`${backendUrl}/login`, loginPayload);
			const token = response.data.token;
			const userID = response.data.userID;
			const firstName = response.data.firstName;
			const lastName = response.data.lastName;
			const email = response.data.email;
			if (token) {
				localStorage.setItem('token', token);
				localStorage.setItem('userID', userID);
				localStorage.setItem('firstName', firstName);
				localStorage.setItem('lastName', lastName);
				localStorage.setItem('email', email);
				console.log('Login successful: ', response.data);
				navigateToHome();
			} else {
				console.error('Login failed: Token not received');
			}
		} catch (err) {
			console.error('Login failed : ', err);
			setIsLoginFailed(true);
		} finally {
			setIsLoginFailed(false);
			setLoading(false);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;
		setLoginPayload((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	useEffect(() => {
		const showAlert = setTimeout(() => {
			setIsLoginFailed(null);
		}, 2000);

		return () => clearTimeout(showAlert);
	}, [isLoginFailed]);

	return (
		<div className="relative w-screen h-screen flex items-center justify-center">
			{/* login page */}
			<div className="w-1/2 h-3/4 border border-black flex">
				<div className="w-1/2 border-r-2 border-black pl-2 pt-2 flex flex-col justify-center items-center">
					<h1>Welcome Back</h1>
					<form action="" className="flex justify-center flex-col" onSubmit={handleLogin}>
						<input
							type="text"
							placeholder="Email"
							className="border border-black"
							name="email"
							value={loginPayload.email}
							onChange={handleInputChange}
							required
						/>
						<input
							type="text"
							placeholder="Password"
							className="border border-black mt-2"
							name="password"
							value={loginPayload.password}
							onChange={handleInputChange}
							required
						/>

						<button className="block" type="submit" onClick={handleAlert}>
							Sign in
						</button>
					</form>

					{/* redirect to register */}
					<div>
						<p className="inline-block mr-2">Don't have account yet?</p>
						<a href="" className="text-blue-600 underline" onClick={navigateToRegister}>
							Sign up
						</a>
					</div>
				</div>

				{/* pictures */}
				<div></div>
			</div>

			{loading && (
				<div className="fixed w-full top-0">
					<LinearProgress className="absolute top-0" />
				</div>
			)}

			{/* if login failed */}
			{isLoginFailed === false && (
				<Alert severity="error" className="fixed top-2 z-10">
					Login error.
				</Alert>
			)}
		</div>
	);
};

export default Login;
