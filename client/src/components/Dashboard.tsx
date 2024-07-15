import React, {createContext, useState, useEffect} from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {Route, Routes} from 'react-router-dom';
import UserProfile from './UserProfile';
import {useAuth} from '../auth/Authentication';
import {backendUrl} from './Login';
import axios from 'axios';
import {AlertInterface, AlertContext} from './Types';
import {Alert, LinearProgress} from '@mui/material';

export interface ImgUrlInterface {
	imgFileUrl: string;
}

export const token = localStorage.getItem('token') || '';

export const commandContext = createContext<ContextProps | undefined>(undefined);
export const imgUrlContext = createContext<ImgUrlInterface | undefined>(undefined);
export const alertContext = createContext<AlertContext | undefined>(undefined);

export type ContextProps = {
	isCommand: boolean;
	toggleCommand: () => void;
	toggleOffCommand: () => void;
};

const Dashboard: React.FC = () => {
	// authorize user
	useAuth();

	// fetch user profile picture
	const [imgFileUrl, setImgFileUrl] = useState<string>('');
	useEffect(() => {
		const fetchUserProfilePict = async () => {
			try {
				if (token !== '') {
					const response = await axios.get(`${backendUrl}/fetchUploads`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (response.data.imgUrl) {
						const imgUrl = response.data.imgUrl;
						setImgFileUrl(imgUrl);
					}
				}
			} catch (err) {
				console.error('error fetching user profile picture : ', err);
			}
		};

		fetchUserProfilePict();
	}, []);

	// command ui
	const [isCommand, setIsCommand] = useState<boolean>(false);

	const toggleCommand = () => {
		setIsCommand((prev) => !prev);
	};

	const toggleOffCommand = () => {
		if (isCommand) {
			toggleCommand();
		}
	};

	// alert ui
	const [alert, setAlert] = useState<AlertInterface>({
		isLoading: false,
		isSuccess: null,
		alertMsg: '',
	});

	// alert
	useEffect(() => {
		if (alert.isSuccess == true || alert.isSuccess == false) {
			const alertDuration = setTimeout(() => {
				setAlert((prev) => ({
					...prev,
					isSuccess: null,
				}));
			}, 2000);

			return () => clearTimeout(alertDuration);
		}
	}, [alert]);

	const toggleAlert = (success: boolean | null, msg: string, loading: boolean) => {
		setAlert((prev) => ({
			...prev,
			isSuccess: success,
			isLoading: loading,
			alertMsg: msg,
		}));
	};

	// fetch user data
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`${backendUrl}/user`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
				if (response.status == 200 && response.data) {
					console.log('user data : ', response.data);
					localStorage.setItem('firstName', response.data.firstName);
					localStorage.setItem('lastName', response.data.lastName);
					localStorage.setItem('email', response.data.email);
					localStorage.setItem('bio', response.data.bio);
				}
			} catch (err) {
				console.error('error fetching user data : ', err);
			}
		};
		fetchUserData();
	}, []);

	console.log('loading : ', alert.isLoading);

	return (
		<alertContext.Provider value={{toggleAlert}}>
			<commandContext.Provider value={{isCommand, toggleCommand, toggleOffCommand}}>
				<div className="relative text-slate-950 bg-slate-50 flex h-full w-full overflow-x-hidden">
					<Sidebar />
					<div className="w-5/6 h-full">
						<imgUrlContext.Provider value={{imgFileUrl}}>
							<Navbar />
							<Routes>
								<Route path="/user/*" element={<UserProfile />} />
							</Routes>
						</imgUrlContext.Provider>
					</div>

					{/* overlay effect command*/}
					<div
						className={`absolute inset-0 ${isCommand ? 'bg-black opacity-50' : 'hidden'} w-full h-full`}
						onClick={toggleOffCommand}
					></div>

					{/* alert ui */}
					{alert.isLoading === true && (
						<div className="fixed top-0 w-full z-10">
							<LinearProgress />
						</div>
					)}

					{/* alert ui */}
					{alert.isSuccess === true ? (
						<Alert severity="success" className="fixed top-2 left-1/2 transform -translate-x-1/2">
							{alert.alertMsg}
						</Alert>
					) : (
						alert.isSuccess === false && (
							<Alert severity="error" className="fixed top-2 left-1/2 transform -translate-x-1/2">
								{alert.alertMsg}
							</Alert>
						)
					)}
				</div>
			</commandContext.Provider>
		</alertContext.Provider>
	);
};

export default Dashboard;
