import React from 'react';
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from './input-otp';
import {OtpPayloadType} from '../OTP';

type InputOTPDemoProps = {
	otp: OtpPayloadType;
	setOtp: React.Dispatch<React.SetStateAction<OtpPayloadType>>;
};

const InputOTPDemo: React.FC<InputOTPDemoProps> = ({otp, setOtp}) => {
	return (
		<InputOTP
			maxLength={4}
			value={otp.otp}
			onChange={(value) =>
				setOtp((prev) => ({
					...prev,
					otp: value,
				}))
			}
		>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
			</InputOTPGroup>
		</InputOTP>
	);
};

export default InputOTPDemo;
