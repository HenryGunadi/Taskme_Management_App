import axios from 'axios';
import images from '../assets/image';
import {Link, useAsyncError, useNavigate} from 'react-router-dom';
import {useState} from 'react';

const ForgotPass: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [otp, setOtp] = useState<number>(0);
	const navigate = useNavigate();

	const sendOTPForgotPass = async () => {
		try {
			const response = await axios.post('/forgotPassword', email, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (err) {
			console.error('error sending email verification : ', err);
		}
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="w-1/2 rounded-lg h-3/5 shadow-lg flex flex-col text-base font-medium items-center justify-center p-6">
				<i className="fa-solid fa-key text-lg text-white bg-indigo-500 rounded-md w-11 h-11 flex justify-center items-center"></i>
				<h1 className="text-2xl font-bold text-center">Forgot Password ?</h1>
				<p className="text-gray-400">Please Enter your email for verification</p>

				<form action="" className="w-3/4 flex-1 flex flex-col justify-between">
					<input type="text" className="w-full mt-16 border-b outline-none pb-1 px-2" placeholder="Enter your email" />

					<button
						type="submit"
						className="rounded-md px-3 py-2 bg-indigo-500 text-white"
						onClick={() => {
							navigate('/OTP');
						}}
					>
						Send 4-digit code
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPass;
