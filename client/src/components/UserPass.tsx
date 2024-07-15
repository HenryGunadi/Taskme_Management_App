import images from '../assets/image';
import React, {useContext, useEffect, useState} from 'react';
import {AlertContext, UserSettingsCtx, ValidateMsgInterface} from './Types';
import {UpdateUserSettingCtx} from './UserProfile';
import {alertContext} from './Dashboard';

function generateRandomPass(int: number): string {
	let result: string = '';
	for (let i = 0; i < int; i++) {
		result += 'a';
	}

	return result;
}

const UserPass: React.FC = () => {
	const [oldPass, setOldPass] = useState<string>('');
	const {toggleAlert} = useContext(alertContext) as AlertContext;
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		toggleAlert(null, '', true);
		setLoading(true);

		const oldPassFetch = async () => {
			try {
				const lenPass: number = await parseInt(localStorage.getItem('passwordLen') || '');
				setOldPass(generateRandomPass(lenPass));
				console.log('oldpass : ', oldPass);
			} catch (err) {
				console.error('error getting oldpass', err);
				toggleAlert(null, '', false);
				setLoading(false);
			} finally {
				toggleAlert(null, '', false);
				setLoading(false);
			}
		};

		oldPassFetch();
	}, []);

	// use context
	const {handleInputSettings, handlePostSettings} = useContext(UpdateUserSettingCtx) as UserSettingsCtx;

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

	const [confirmPass, setConfirmPass] = useState<string>('');
	const [same, setSame] = useState<boolean>(false);

	useEffect(() => {
		setNewPass('');
		setConfirmPass('');
		setSame(false);
		const newValidateMsg = validateMsg.map((msg) => ({...msg, error: true}));
		setValidateMsg(newValidateMsg);
	}, [isChangePass]);

	const handleChangePass = () => {
		setIsChangePass(true);
	};

	const handleChangePassKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setIsChangePass(false);
		}
	};

	const handleConfirmPass = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setConfirmPass(value);
		if (value === newPass && newPass !== '') {
			setSame(true);
		}
		handleInputSettings(e);
	};

	let hasError = validateMsg.some((msg) => msg.error);

	// toggle eye UI
	const [eyeOff, setEyeOff] = useState<boolean>(false);
	const toggleEye = () => {
		setEyeOff((prev) => !prev);
	};

	const handleSaveChanges = () => {
		if (same) {
			handlePostSettings();
			setOldPass(confirmPass);
			localStorage.setItem('passwordLen', String(confirmPass.length));
			setIsChangePass(false);
		}
	};

	if (loading) {
		return <></>;
	}

	return (
		<>
			<div className="w-5/12 text-sm font-semibold tracking-wide">
				<label htmlFor="oldPass" className="flex items-center">
					Old Password <img src={images.lock} className="w-5 h-auto object-cover object-center mx-1" />
				</label>
				<div id="oldPass" className="flex bg-white border border-black w-full justify-between px-4 py-2 rounded-md mt-2 mb-8">
					<input className="w-full outline-none border-none bg-transparent" readOnly type="password" value={oldPass} />
					<img src={images.eyeOff} alt="" className="min-w-5 w-5 h-auto object-cover object-center" />
				</div>

				<label htmlFor="oldPass">New Password</label>
				<div
					id="oldPass"
					className={`flex bg-white border ${
						isChangePass && (hasError === true ? 'border-red-500' : 'border-green-500')
					} w-full justify-between px-4 py-2 rounded-md mt-2 mb-4 ${!isChangePass && 'border-black'}`}
				>
					<input
						type={eyeOff ? 'password' : 'text'}
						className="outline-none border-none bg-transparent w-full"
						onChange={handleInputPass}
						onClick={handleChangePass}
						onKeyDown={handleChangePassKey}
						readOnly={!isChangePass ? true : undefined}
						value={isChangePass ? newPass : ''}
					/>
					<img
						src={eyeOff ? images.eyeOff : images.eye}
						alt=""
						className="min-w-5 w-5 h-auto object-cover object-center hover:cursor-pointer"
						onClick={toggleEye}
					/>
				</div>

				{isChangePass && (
					<ul style={{listStyleType: 'disc'}} className="ml-5 text-slate-600 mt-4 mb-8">
						{validateMsg.map((item: any, index: number) => (
							<li className={item.error === true ? 'text-red-500' : ''} key={index}>
								{item.errorMsg}
							</li>
						))}
					</ul>
				)}

				{isChangePass && !hasError && (
					<>
						<label htmlFor="confirmPass">Confirm New Password</label>
						<div
							id="oldPass"
							className={`flex bg-white border ${
								same === true ? 'border-green-500' : 'border-red-500'
							} w-full justify-between px-4 py-2 rounded-md mt-2`}
						>
							<input
								type="password"
								className="outline-none border-none bg-transparent w-full"
								onChange={handleConfirmPass}
								value={isChangePass ? confirmPass : ''}
								onKeyDown={handleChangePassKey}
								name="password"
							/>
							<img src={images.eyeOff} alt="" className="min-w-5 w-5 h-auto object-cover object-center" />
						</div>

						<button className="px-4 py-2 rounded-md bg-green-500 text-white mt-8" onClick={handleSaveChanges}>
							Save Changes
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default UserPass;
