import {DashboardContext} from './Dashboard';
import FileUpload from './FileUpload';
import {DashboardContextType, UserSettingsCtx} from './Types';
import {useContext, useEffect} from 'react';
import {FileInterface, FileUploadContext, UpdateUserSettingCtx} from './UserProfile';

const ProfileSettings: React.FC = () => {
	// use context
	const {imgFileUrl} = useContext(DashboardContext) as DashboardContextType;
	const {imgFilePreview} = useContext(FileUploadContext) as FileInterface;
	const {dataSettings, handleInputSettings, handlePostSettings, isChanged} = useContext(UpdateUserSettingCtx) as UserSettingsCtx;

	// refresh window func
	const refreshPage = () => {
		window.location.reload();
	};

	return (
		<>
			<div className="w-full pr-4 flex mb-3 tablet:mb-0">
				<div className="tablet:w-1/4">
					<div className="w-fit">
						<img
							src={!imgFilePreview ? imgFileUrl : imgFilePreview}
							alt=""
							className="w-24 h-24 tablet:w-36 tablet:h-36 rounded-full bg-black object-cover object-center border border-black image-rendering-auto"
						/>

						<h1 className="text-lg text-slate-900 font-semibold my-2 text-center">{dataSettings.firstName}</h1>
					</div>
				</div>

				<FileUpload />
			</div>

			<div className="w-full flex justify-end">
				<div className="tablet:w-3/4 w-full">
					<div className="text-sm flex w-full">
						<div className="mr-4 w-1/2">
							<label htmlFor="firstName" className="font-medium">
								First Name <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								value={dataSettings.firstName}
								id="firstName"
								name="firstName"
								className="block my-1 py-2 px-4 rounded-md border border-black w-full"
								onChange={handleInputSettings}
							/>
						</div>

						<div className="w-1/2">
							<label htmlFor="lastName" className="font-medium">
								Last Name <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								name="lastName"
								id="lastName"
								className="block my-1 py-2 px-4 rounded-md border border-black w-full"
								value={dataSettings.lastName}
								onChange={handleInputSettings}
							/>
						</div>
					</div>

					<div className="w-full my-4">
						<label htmlFor="email" className="font-medium">
							Email <span className="text-red-600">*</span>
						</label>
						<input
							type="email"
							value={dataSettings.email}
							id="email"
							name="email"
							className="block my-1 py-2 px-4 rounded-md border border-black w-full mb-4"
							onChange={handleInputSettings}
						/>

						<label htmlFor="bio" className="font-medium">
							Bio <span className="text-red-600">*</span>
						</label>
						<textarea
							value={dataSettings.bio}
							id="bio"
							name="bio"
							className="block my-1 py-2 px-4 rounded-md border border-black w-full h-36"
							onChange={handleInputSettings}
						></textarea>
					</div>

					<button
						className="px-3 py-2 bg-green-600 rounded-md text-white font-medium tracking-wide my-2 hover:cursor-pointer duration-100 hover:ease-linear hover:opacity-70"
						onClick={handlePostSettings}
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
			</div>
		</>
	);
};

export default ProfileSettings;
