import axios from 'axios';
import {RegisterUserPayload, ValidateMsgInterface} from './Types';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

// path prefix to backend
const backendBaseUrl: string = 'http://localhost:8080/api/v1';

const Register: React.FC = () => {
	// react router dom
	const navigate = useNavigate();
	const navigateToLogin = () => {
		navigate(`/login`);
	};

	// set empty formData
	const [formData, setFormData] = useState<RegisterUserPayload>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	});

	// handle submitform function
	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (hasError) {
			window.alert('password is incorrect');
			return;
		}

		try {
			const response = await axios.post(`${backendBaseUrl}/register`, formData);

			window.alert('Sign up successful');
			navigateToLogin();
		} catch (err) {
			console.error(`Registration failed: `, err);
			window.alert('user already exists');
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const [isPassword, setIsPassword] = useState<boolean>(false);
	const [validateMsgRegis, setValidateMsgRegis] = useState<ValidateMsgInterface[]>([
		{
			error: true,
			errorMsg: 'Password must be at least 8 characters long.',
		},
		{
			error: true,
			errorMsg: 'Password must include at least one uppercase letter.',
		},
		{
			error: true,
			errorMsg: 'Password must include at least one lowercase letter.',
		},
		{
			error: true,
			errorMsg: 'Password must include at least one number.',
		},
		{
			error: true,
			errorMsg: 'Password must include at least one special character.',
		},
	]);

	const handleValidateMsgRegister = (password: string) => {
		const newValidateMsg = [...validateMsgRegis];

		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		newValidateMsg[0].error = password.length < minLength;
		newValidateMsg[1].error = !hasUpperCase;
		newValidateMsg[2].error = !hasLowerCase;
		newValidateMsg[3].error = !hasNumber;
		newValidateMsg[4].error = !hasSpecialChar;

		setValidateMsgRegis(newValidateMsg);
	};

	const handlePassRegisterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
		const password: string = value;

		handleValidateMsgRegister(password);
	};

	const handleIsPassword = () => {
		setIsPassword((prev) => !prev);
	};

	useEffect(() => {
		if (isPassword === false) {
			setFormData((prev) => ({
				...prev,
				password: '',
			}));
		}
	}, [isPassword]);

	// check if there is any error on the password
	const hasError: boolean = validateMsgRegis.some((msg) => msg.error);

	return (
		<div className="w-screen h-screen flex justify-center items-center text-sm">
			{/* register container */}
			<div className="w-full laptop:w-1/3 h-3/4  flex flex-col justify-center items-center rounded-lg laptop:shadow-lg m-6">
				<h1 className="font-bold text-xl ">Sign up</h1>
				<form action="" className="flex flex-col w-full items-center" onSubmit={handleFormSubmit}>
					<input
						type="text"
						className="mt-2 border px-3 py-2 rounded-lg outline-none w-3/4"
						placeholder="First Name"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						onClick={() => setIsPassword(false)}
						required
					/>
					<input
						type="text"
						className="mt-2 border px-3 py-2 rounded-lg outline-none w-3/4"
						placeholder="Last Name"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						onClick={() => setIsPassword(false)}
						required
					/>
					<input
						type="email"
						className="mt-2 border px-3 py-2 rounded-lg outline-none w-3/4"
						placeholder="Email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						onClick={() => setIsPassword(false)}
						required
					/>
					<input
						type="password"
						className="mt-2 border px-3 py-2 rounded-lg outline-none w-3/4"
						placeholder="Password"
						name="password"
						value={formData.password}
						onChange={handlePassRegisterInput}
						onClick={handleIsPassword}
						readOnly={isPassword ? false : true}
						required
					/>
					{isPassword && (
						<ul className="my-2 w-3/4">
							{validateMsgRegis.map((item: any, index: number) => (
								<li key={index} className={`${item.error ? 'text-red-500' : 'text-slate-500'}`}>
									{item.errorMsg}
								</li>
							))}
						</ul>
					)}

					<button type="submit" className="w-3/4 font-medium px-3 py-2 bg-indigo-500 mt-4 rounded-lg text-white">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
