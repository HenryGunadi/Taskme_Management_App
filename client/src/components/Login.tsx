import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {LoginUserPayload} from './Types';
import {Alert, LinearProgress} from '@mui/material';
import images from '../assets/image';

export const backendUrl: string = 'http://localhost:8080/api/v1';

const Login: React.FC = () => {
	// React Router
	const navigate = useNavigate();
	const navigateToRegister = () => {
		navigate(`/register`);
	};
	const navigateToHome = () => {
		navigate(`/main/dashboard`);
	};

	const [isLoginFailed, setIsLoginFailed] = useState<boolean | null>(null);
	const [loading, setLoading] = useState<boolean>(false); // loading UI

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
			if (response.status === 202) {
				const token = response.data.token;
				if (token) {
					localStorage.setItem('token', token);
					navigateToHome();
				} else {
					console.error('Login failed: Token not received');
				}
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

	useEffect(() => {
		localStorage.setItem('passwordLen', String(loginPayload.password.length));
	}, [handleLogin]);

	return (
		<div className="relative w-screen h-screen flex items-center justify-center">
			<div className="absolute flex laptop:left-6 left-3 top-4 gap-2">
				<h1 className="text-2xl text-indigo-400 font-bold tracking-wider">TASKME</h1>
				<img src={images.target} alt="" className="w-8 h-auto object-cover " style={{imageRendering: 'auto'}} />
			</div>
			{/* login page */}
			<div className="w-1/2 h-3/4  flex rounded-lg shadow-lg p-4 text-slate-700">
				<div className="w-1/2 flex flex-col justify-center text-center">
					<h1 className="font-medium mb-4 text-base">Welcome Back</h1>
					<form action="" className="flex justify-center flex-col gap-2 text-sm items-center w-full" onSubmit={handleLogin}>
						<input
							type="text"
							placeholder="Email"
							className="border rounded-lg py-2 px-3 outline-none w-3/4"
							name="email"
							value={loginPayload.email}
							onChange={handleInputChange}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							className="border rounded-lg py-2 px-3 outline-none mt-2 w-3/4"
							name="password"
							value={loginPayload.password}
							onChange={handleInputChange}
							required
						/>
						<div className="w-3/4 text-start ">
							<a href="" className="">
								Forgot password ?
							</a>
						</div>

						<button
							className="block text-base mt-2 px-3 py-2 w-3/4 rounded-lg font-medium mb-2 text-white bg-indigo-500"
							type="submit"
							onClick={handleAlert}
						>
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
				<div className="w-1/2 h-full flex items-center">
					<img src={images.task} alt="" className="w-full h-auto object-cover object-center" />
				</div>
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
