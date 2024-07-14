import {imgUrlContext, ImgUrlInterface} from './Dashboard';
import FileUpload from './FileUpload';
import {UserInfo} from './Dashboard';
import axios from 'axios';
import {backendUrl} from './Login';
import {token} from '../App';
import {changeSettingsPayload} from './Types';
import {useContext, useState} from 'react';
import {FileInterface, FileUploadContext} from './UserProfile';

const ProfileSettings: React.FC = () => {
	// context
	const {imgFileUrl} = useContext(imgUrlContext) as ImgUrlInterface;
	const {imgFilePreview} = useContext(FileUploadContext) as FileInterface;

	const [isChanged, setIsChanged] = useState<boolean>(false);

	const [newSettings, setNewSettings] = useState<changeSettingsPayload>({
		firstName: UserInfo.firstName,
		lastName: UserInfo.lastName,
		email: UserInfo.email,
		bio: UserInfo.bio,
	});

	const handleSubmitSettings = async () => {
		if (newSettings) {
			try {
				const response = await axios.post(`${backendUrl}/changeSettings`, newSettings, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-type': 'application/json',
					},
				});
				console.log('response change settings : ', response.data);
			} catch (err) {
				console.error('error changing password : ', err);
			}
		}
	};

	const handleChangeSettings = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setNewSettings((prev) => ({
			...prev,
			[name]: value,
		}));
		setIsChanged(true);
	};

	// refresh window func
	const refreshPage = () => {
		window.location.reload();
	};

	return (
		<>
			<div className="w-fit mr-4">
				<img
					src={!imgFilePreview ? imgFileUrl : imgFilePreview}
					alt=""
					className="w-36 h-36 rounded-full bg-black object-cover object-center border border-black image-rendering-auto min-w-36"
				/>
				<h1 className="text-center text-lg text-slate-900 font-semibold my-2">{UserInfo.firstName}</h1>
			</div>

			<div className="w-4/5 mr-4">
				<div className="flex items-center h-36">
					<FileUpload />
				</div>

				<div className="text-sm flex w-full ml-4">
					<div className="mr-4 w-1/2">
						<label htmlFor="firstName" className="font-medium">
							First Name <span className="text-red-600">*</span>
						</label>
						<input
							type="text"
							value={newSettings.firstName}
							id="firstName"
							name="firstName"
							className="block my-1 py-2 px-4 rounded-md border border-black w-full"
							onChange={handleChangeSettings}
						/>
					</div>

					<div className="ml-4 w-1/2">
						<label htmlFor="lastName" className="font-medium">
							Last Name <span className="text-red-600">*</span>
						</label>
						<input
							type="text"
							name="lastName"
							id="lastName"
							className="block my-1 py-2 px-4 rounded-md border border-black w-full"
							value={newSettings.lastName}
							onChange={handleChangeSettings}
						/>
					</div>
				</div>

				<div className="w-full my-4 ml-4">
					<label htmlFor="email" className="font-medium">
						Email <span className="text-red-600">*</span>
					</label>
					<input
						type="email"
						value={newSettings.email}
						id="email"
						name="email"
						className="block my-1 py-2 px-4 rounded-md border border-black w-full mb-4"
						onChange={handleChangeSettings}
					/>

					<label htmlFor="bio" className="font-medium">
						Bio <span className="text-red-600">*</span>
					</label>
					<textarea
						value={newSettings.bio}
						id="bio"
						name="bio"
						className="block my-1 py-2 px-4 rounded-md border border-black w-full h-36"
						onChange={handleChangeSettings}
					></textarea>
				</div>

				<button
					className="ml-4 px-4 py-2 bg-green-600 rounded-md text-white font-medium tracking-wide my-2 hover:cursor-pointer duration-100 hover:ease-linear hover:opacity-70"
					onClick={handleSubmitSettings}
				>
					Save changes
				</button>

				{isChanged === true ? (
					<button
						onClick={refreshPage}
						className="ml-4 px-4 py-2 bg-red-600 rounded-md text-white font-medium tracking-wide my-2 hover:cursor-pointer duration-100 hover:ease-linear hover:opacity-70"
					>
						Discard changes
					</button>
				) : (
					''
				)}
			</div>
		</>
	);
};

export default ProfileSettings;
