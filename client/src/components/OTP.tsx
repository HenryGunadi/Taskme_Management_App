import axios from 'axios';
import InputOTPDemo from './ui/InputOTPUi';
import {backendUrl} from './Login';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export type OtpPayloadType = {
	otpID: string;
	otp: string;
};

const OTP: React.FC = () => {
	const userEmail = localStorage.getItem('otpEmail');
	const [otpPayload, setOtpPayload] = useState<OtpPayloadType>({
		otpID: localStorage.getItem('otp') || '',
		otp: '',
	});

	const navigate = useNavigate();

	const validateOTP = async () => {
		try {
			const response = await axios.post(`${backendUrl}/validateOTP`, otpPayload, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200 && response.data) {
				navigate('/changePassword');
				const otpToken: string = response.data.token;
				localStorage.setItem('otpToken', otpToken);
			}
		} catch (err) {
			console.error('error sending otp validation : ', err);
		}
	};

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<div className="w-full laptop:w-1/2 rounded-lg m-6 laptop:shadow-lg h-3/5 flex flex-col justify-center items-center">
				<div className="flex flex-col items-center justify-between py-6 w-fit h-full">
					<div className="flex flex-col items-center justify-center">
						<i className="fa-solid fa-envelope flex w-11 h-11 rounded-md bg-indigo-500 items-center justify-center text-white text-lg"></i>
						<div className="pt-2 pb-8">
							<h1 className="text-2xl text-center font-bold">Enter your code</h1>
							<p className="text-center">
								We sent a code to <span className="font-bold underline">{userEmail || ''}</span>
							</p>
						</div>

						<InputOTPDemo otp={otpPayload} setOtp={setOtpPayload} />

						<p className="text-sm py-2">
							Didn't receive the email ? <span className="font-bold underline">Click to resend</span>
						</p>
					</div>

					<button className="rounded-md bg-indigo-500 text-white px-3 py-2 items-center justify-center w-full" onClick={validateOTP}>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
};

export default OTP;
