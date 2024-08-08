import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {backendUrl} from './Login';
import Loading from './ui/Loading';

const ForgotPass: React.FC = () => {
	const [email, setEmail] = useState<string[]>([]);
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const sendOTPForgotPass = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await axios.post(`${backendUrl}/otp`, email, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.status === 200 && response.data) {
				localStorage.setItem('otp', response.data.otp);
				localStorage.setItem('otpEmail', email[0]);
				navigate('/OTP');
			}
		} catch (err) {
			console.error('error sending email verification : ', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		setEmail([value]);
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="w-full laptop:w-1/2 rounded-lg h-3/5 laptop:shadow-lg flex flex-col text-base font-medium items-center justify-center p-6">
				<i className="fa-solid fa-key text-lg text-white bg-indigo-500 rounded-md w-11 h-11 flex justify-center items-center mb-2"></i>
				<h1 className="text-2xl font-bold text-center">Forgot Password ?</h1>
				<p className="text-gray-400 text-center">Please Enter your email for verification</p>

				<form action="" className="w-3/4 flex-1 flex flex-col justify-between" onSubmit={sendOTPForgotPass}>
					<input
						type="text"
						className="w-full mt-16 border-b outline-none pb-1 px-2"
						placeholder="Enter your email"
						value={email[0] || ''}
						onChange={handleInputEmail}
					/>

					<button type="submit" className="rounded-md px-3 py-2 bg-indigo-500 text-white">
						Send 4-digit code
					</button>
				</form>
			</div>

			{isLoading && <Loading />}
		</div>
	);
};

export default ForgotPass;
