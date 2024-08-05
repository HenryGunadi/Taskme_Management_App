import React, {createContext, useState, useEffect, useContext} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import UserPass from './UserPass';
import {UserRoutes, User, UserSettingsCtx, DashboardContextType} from './Types';
import axios from 'axios';
import {backendUrl} from './Login';
import {DashboardContext} from './Dashboard';
import images from '../assets/image';

export interface FileInterface {
	togglePreview: (url: string) => void;
	imgFilePreview: string | null;
}

export const FileUploadContext = createContext<FileInterface | null>(null);
export const UpdateUserSettingCtx = createContext<UserSettingsCtx | null>(null);

const UserProfile: React.FC = () => {
	const token = localStorage.getItem('token');

	// use context
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	// simple toggle image preview state
	const [imgFilePreview, setIsImgFilePreview] = useState<string | null>(null);
	const togglePreview = (url: string) => {
		setIsImgFilePreview(url);
	};

	// react router
	const navigate = useNavigate();
	const navigateTo = (route: string) => {
		navigate(`/main/user/${route}`);
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
		if (token) {
			try {
				const response = await axios.post(`${backendUrl}/settings`, dataSettings, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
				if (response.status === 200) {
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
		}
	}; // handle submit changes

	return (
		<FileUploadContext.Provider value={{togglePreview, imgFilePreview}}>
			<div className="py-4 px-3 tablet:px-6 flex flex-col flex-grow overflow-x-hidden">
				<h1 className="text-xl font-semibold pb-2">Account settings</h1>

				{/* account settings main container */}
				<div className="flex w-full py-2">
					{/* mini side-bar */}
					<div className="tablet:flex flex-col bg-white h-fit py-4 w-1/5 rounded-lg hidden shadow-sm font-medium gap-1">
						<div
							className="py-2 px-4 hover:cursor-pointer flex gap-2"
							onClick={() => {
								navigateTo(userRoutes[0].route);
							}}
						>
							<img src={images.settingsGray} alt="" className="w-4" />
							<h1 className="hover:underline transition hover:cursor-pointer duration-300">Profile settings</h1>
						</div>
						<div
							className="py-2 px-4 hover:cursor-pointer flex gap-2"
							onClick={() => {
								navigateTo(userRoutes[1].route);
							}}
						>
							<img src={images.lockGray} alt="" className="w-4" />
							<h1 className="hover:underline transition hover:cursor-pointer duration-300">Password</h1>
						</div>
						<div
							className="py-2 px-4 hover:cursor-pointer flex gap-2"
							onClick={() => {
								navigateTo(userRoutes[2].route);
							}}
						>
							<img src={images.notification} alt="" className="w-4" />
							<h1 className="hover:underline transition hover:cursor-pointer duration-300">Notifications</h1>
						</div>
					</div>

					{/* main settings */}
					<UpdateUserSettingCtx.Provider value={{dataSettings, handleInputSettings, handlePostSettings, isChanged}}>
						<div className="bg-white px-6 py-6 w-full tablet:w-4/5 font-normal text-sm text-slate-900 tracking-wide rounded-lg tablet:ml-6 shadow-sm">
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
