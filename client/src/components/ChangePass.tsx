import {useCommandState} from 'cmdk';
import React, {useEffect, useState} from 'react';
import {ValidateMsgInterface} from './Types';
import images from '../assets/image';
import {Eye, Images, UserMinus} from 'lucide-react';
import axios from 'axios';
import {backendUrl} from './Login';
import {useNavigate} from 'react-router-dom';
import {Alert, LinearProgress} from '@mui/material';

type ChangePassType = {
	email: string;
	newPass: string;
};

const ChangePass: React.FC = () => {
	const userEmail = localStorage.getItem('otpEmail');
	const otpToken = localStorage.getItem('otpToken');

	const navigate = useNavigate();

	const [newPass, setNewPass] = useState<string>('');
	const [confirmPass, setConfirmPass] = useState<string>('');
	const [isSame, setIsSame] = useState<boolean>(false);
	const [isChangePass, setIsChangePass] = useState<boolean>(false);
	const [isEyeOff, setIsEyeOff] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const payload: ChangePassType = {
		email: userEmail || '',
		newPass: newPass,
	};

	const handelEyeIcon = () => {
		setIsEyeOff((prev) => !prev);
	};

	const handleNewPass = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewPass(value);
		handleValidateChange(value);
	};

	const handleConfirmPass = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setConfirmPass(value);
	};

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

	const hasError = validateMsg.some((value) => value.error);

	const handleValidateChange = (password: string) => {
		const newValidateMsg = [...validateMsg];
		// rules
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

	const UnmountChangePass = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setIsChangePass(false);
			setNewPass('');
			setConfirmPass('');
		}
	};

	useEffect(() => {
		if (confirmPass === newPass && newPass !== '') {
			setIsSame(true);
		} else {
			setIsSame(false);
		}
	}, [confirmPass]);

	const changeUserPass = async () => {
		if (otpToken && isSame && !hasError) {
			try {
				setIsLoading(true);
				const response = await axios.patch(`${backendUrl}/settings`, payload, {
					headers: {
						Authorization: `Bearer ${otpToken}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.status === 200 && response.data) {
					localStorage.removeItem('otpEmail');
					localStorage.removeItem('otpToken');
					setIsSuccess(true);
					navigate('/login');
				}
			} catch (err) {
				setIsSuccess(false);
				console.error('error changing user password : ', err);
			} finally {
				setIsLoading(false);
			}
		} else {
			setIsSuccess(false);
		}
	};

	useEffect(() => {
		if (isSuccess === true || isSuccess === false) {
			const alertDuration = setTimeout(() => {
				setIsSuccess(null);
			}, 3000);

			return () => clearTimeout(alertDuration);
		}
	}, [isSuccess]);

	return (
		<div className="w-full h-full flex justify-center items-center text-sm">
			<div className="w-fit h-fit flex flex-col rounded-lg shadow-lg p-8">
				<div className="w-full flex justify-center">
					<i className="fa-solid fa-key text-lg text-white bg-indigo-500 rounded-md w-11 h-11 flex justify-center items-center"></i>
				</div>

				<h1 className="font-bold text-center text-xl mt-2">Set New Password</h1>
				<div className="w-full flex justify-center">
					<p className="text-gray-400 font-medium text-center w-2/3">Your new password must be different to previously used passwords.</p>
				</div>

				<div>
					<div className="mt-8 mb-2">
						<label htmlFor="newPass mb-2">New Password</label>
						<div
							className={`border rounded-md w-full px-3 py-1 ${
								!hasError ? 'border-green-500' : 'border-red-500'
							} flex justify-between items-center`}
						>
							<input
								type={!isEyeOff ? 'text' : 'password'}
								id="newPass"
								value={newPass}
								onChange={handleNewPass}
								onClick={() => {
									setIsChangePass(true);
								}}
								onKeyDown={UnmountChangePass}
								className="outline-none flex-1"
							/>

							<img
								src={isEyeOff ? images.eyeGrayOff : images.eyeGray}
								alt=""
								onClick={handelEyeIcon}
								className="object-cover object-center transition hover:cursor-pointer hover:opacity-70 duration-150 w-4 h-4"
							/>
						</div>

						<ul style={{listStyleType: 'disc'}} className="ml-5 text-slate-600 mb-3">
							{validateMsg.map((item: any, index: number) => (
								<li className={item.error === true ? 'text-red-500' : ''} key={index}>
									{item.errorMsg}
								</li>
							))}
						</ul>
					</div>

					<div className="mb-8">
						<label htmlFor="confirmPass">Confirm Password</label>
						<div
							className={`border rounded-md w-full px-3 py-1 ${
								isSame ? 'border-green-500' : 'border-red-500'
							} flex justify-between items-center`}
						>
							<input type="password" id="newPass" value={confirmPass} onChange={handleConfirmPass} className="outline-none flex-1" />
							<img src={images.eyeGrayOff} alt="" className="object-cover object-center w-4 h-4" />
						</div>
					</div>

					<button
						className="bg-indigo-500 px-3 py-2 text-white w-full rounded-md font-medium transition hover:opacity-70 duration-150"
						onClick={changeUserPass}
					>
						Reset Password
					</button>
				</div>
			</div>

			{/* alert ui */}
			{isLoading && (
				<div className="fixed top-0 w-full z-10">
					<LinearProgress />
				</div>
			)}

			{/* alert ui */}
			{isSuccess ? (
				<div className="fixed flex justify-center top-0 w-full mt-2">
					<Alert severity="success" className="">
						Password changed.
					</Alert>
				</div>
			) : (
				isSuccess === false && (
					<div className="fixed flex justify-center top-0 w-full mt-2">
						<Alert severity="error" className="">
							Invalid password or token.
						</Alert>
					</div>
				)
			)}
		</div>
	);
};

export default ChangePass;
