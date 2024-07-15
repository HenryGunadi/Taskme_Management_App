import React, {createContext, useState, useEffect, useContext} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import UserPass from './UserPass';
import {UserRoutes, User, UserSettingsCtx, AlertContext} from './Types';
import axios from 'axios';
import {backendUrl} from './Login';
import {alertContext, token} from './Dashboard';

export interface FileInterface {
	togglePreview: (url: string) => void;
	imgFilePreview: string | null;
}

export const FileUploadContext = createContext<FileInterface | null>(null);
export const UpdateUserSettingCtx = createContext<UserSettingsCtx | null>(null);

const UserProfile: React.FC = () => {
	// use context
	const {toggleAlert} = useContext(alertContext) as AlertContext;

	// simple toggle image preview state
	const [imgFilePreview, setIsImgFilePreview] = useState<string | null>(null);
	const togglePreview = (url: string) => {
		setIsImgFilePreview(url);
	};

	// react router
	const navigate = useNavigate();
	const navigateTo = (route: string) => {
		navigate(`/dashboard/user/${route}`);
	};

	const userRoutes: UserRoutes[] = [
		{
			route: 'profile',
		},
		{
			route: 'password',
		},
		{
			route: 'notifications',
		},
	]; // routes in user route

	const [dataSettings, setDataSettings] = useState<User>({
		firstName: '',
		lastName: '',
		password: '',
		email: '',
		bio: '',
	}); // use state for data settings

	useEffect(() => {
		const storedSettings = {
			firstName: localStorage.getItem('firstName') || '',
			lastName: localStorage.getItem('lastName') || '',
			email: localStorage.getItem('email') || '',
			bio: localStorage.getItem('bio') || '',
		};
		setDataSettings((prevSettings) => ({...prevSettings, ...storedSettings}));
	}, []);

	const [isChanged, setIsChanged] = useState<boolean>(false); // toggle save changes button

	const handleInputSettings = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setDataSettings((prev) => ({
			...prev,
			[name]: value,
		}));

		setIsChanged(true);
	}; // handle input on change

	const handlePostSettings = async () => {
		toggleAlert(null, '', true);
		try {
			const response = await axios.post(`${backendUrl}/settings`, dataSettings, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			if (response.status === 200) {
				console.log('changing user setting response : ', response.data);
				// Update localStorage with new settings
				localStorage.setItem('firstName', dataSettings.firstName);
				localStorage.setItem('lastName', dataSettings.lastName);
				localStorage.setItem('email', dataSettings.email);
				localStorage.setItem('bio', dataSettings.bio);
			}
		} catch (err) {
			console.error('error changing user settings : ', err);
			toggleAlert(false, 'Something went wrong', false);
		} finally {
			setIsChanged(false);
			toggleAlert(true, 'Changes saved', false);
		}
	}; // handle submit changes

	return (
		<FileUploadContext.Provider value={{togglePreview, imgFilePreview}}>
			<div className="bg-slate-200 pl-4 py-4 pr-6">
				<h1 className="text-xl font-semibold pb-4">Account settings</h1>

				{/* account settings main container */}
				<div className="flex w-full py-2 ">
					{/* mini side-bar */}
					<div className="flex flex-col bg-slate-50 h-fit py-4 w-1/5 rounded-2xl">
						<div
							className="py-2 px-4 hover:cursor-pointer"
							onClick={() => {
								navigateTo(userRoutes[0].route);
							}}
						>
							<img src="" alt="" />
							<h1>Profile settings</h1>
						</div>
						<div
							className="py-2 px-4 hover:cursor-pointer"
							onClick={() => {
								navigateTo(userRoutes[1].route);
							}}
						>
							<img src="" alt="" />
							<h1>Password</h1>
						</div>
						<div
							className="py-2 px-4 hover:cursor-pointer"
							onClick={() => {
								navigateTo(userRoutes[2].route);
							}}
						>
							<img src="" alt="" />
							<h1>Notifications</h1>
						</div>
					</div>

					{/* main settings */}
					<UpdateUserSettingCtx.Provider value={{dataSettings, handleInputSettings, handlePostSettings, isChanged}}>
						<div className="bg-slate-50 px-8 py-6 w-4/5 ml-4 flex font-normal text-sm text-slate-900 tracking-wide rounded-2xl">
							<Routes>
								<Route path="/profile" element={<ProfileSettings />} />
								<Route path="/password" element={<UserPass />} />
							</Routes>
						</div>
					</UpdateUserSettingCtx.Provider>
				</div>
			</div>
		</FileUploadContext.Provider>
	);
};

export default UserProfile;
