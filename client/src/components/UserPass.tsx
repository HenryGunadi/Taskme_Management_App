import images from '../assets/image';
import React, {useState} from 'react';
import {ValidateMsgInterface} from './Types';

const UserPass: React.FC = () => {
	// password characters
	const [isChangePass, setIsChangePass] = useState<boolean>(false);
	const [newPass, setNewPass] = useState<string>('');
	const [validateMsg, setValidateMsg] = useState<ValidateMsgInterface[]>([
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

	const handleValidateChange = (password: string) => {
		const newValidateMsg = [...validateMsg];
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

		setValidateMsg(newValidateMsg);
	};

	const handleInputPass = (e: React.ChangeEvent<HTMLInputElement>) => {
		const pass = e.target.value;
		handleValidateChange(pass);
		setNewPass(pass);
	};

	const handleChangePass = () => {
		setIsChangePass((prev) => !prev);
	};

	let hasError = validateMsg.some((msg) => msg.error);

	return (
		<>
			<div className="w-5/12 text-sm font-semibold tracking-wide">
				<label htmlFor="oldPass" className="flex items-center">
					Old password <img src={images.lock} className="w-5 h-auto object-cover object-center mx-1" />
				</label>
				<div id="oldPass" className="flex bg-white border border-black w-full justify-between px-4 py-2 rounded-md mt-2 mb-8">
					<input type="password" className="w-full outline-none border-none bg-transparent" readOnly />
					<img src={images.eyeOff} alt="" className="min-w-5 w-5 h-auto object-cover object-center hover:cursor-pointer" />
				</div>

				<label htmlFor="oldPass">New password</label>
				<div
					id="oldPass"
					className={`flex bg-white border ${
						isChangePass && (hasError === true ? 'border-red-500' : 'border-green-500')
					} w-full justify-between px-4 py-2 rounded-md mt-2 mb-4 ${!isChangePass && 'border-black'}`}
				>
					<input
						type="password"
						className="outline-none border-none bg-transparent w-full"
						onChange={handleInputPass}
						onClick={handleChangePass}
						readOnly={!isChangePass ? true : undefined}
						value={isChangePass ? newPass : ''}
					/>
					<img src={images.eye} alt="" className="min-w-5 w-5 h-auto object-cover object-center hover:cursor-pointer" />
				</div>

				{isChangePass == true && (
					<ul style={{listStyleType: 'disc'}} className="ml-5 text-slate-600 my-4">
						{validateMsg.map((item: any) => (
							<li className={item.error === true ? 'text-red-500' : ''}>{item.errorMsg}</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};

export default UserPass;
