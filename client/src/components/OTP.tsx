import {InputOTPDemo} from './ui/InputOTPUi';

const OTP: React.FC = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<div className="w-1/2 rounded-lg shadow-lg h-3/5 flex flex-col justify-center items-center">
				<div className="flex flex-col items-center justify-between py-6 w-fit h-full">
					<div className="flex flex-col items-center justify-center">
						<i className="fa-solid fa-envelope flex w-11 h-11 rounded-md bg-indigo-500 items-center justify-center text-white text-lg"></i>
						<div className="pt-4 pb-8">
							<h1 className="text-2xl text-center font-bold">Enter your code</h1>
							<p className="text-center">
								We sent a code to <span className="font-bold underline">henrywilliamgunadi25@gmail.com</span>
							</p>
						</div>

						<InputOTPDemo />

						<p className="text-sm py-2">
							Didn't receive the email ? <span className="font-bold underline">Click to resend</span>
						</p>
					</div>

					<button className="rounded-md bg-indigo-500 text-white px-3 py-2 items-center justify-center w-full">Continue</button>
				</div>
			</div>
		</div>
	);
};

export default OTP;
