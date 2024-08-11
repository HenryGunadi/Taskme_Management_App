import React, {useContext, useState} from 'react';
import axios from 'axios';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {DashboardContextType, filePayload} from './Types';
import {backendUrl} from './Login';
import {FileInterface, FileUploadContext} from './UserProfile';
import {firebaseApp} from './Firebase';
import {DashboardContext} from './Dashboard';

const FileUpload: React.FC = () => {
	// context
	const {togglePreview} = useContext(FileUploadContext) as FileInterface;
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	const token: string | null = localStorage.getItem('token');

	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setFile(file);
			togglePreview(URL.createObjectURL(file));
		}
	};

	const handleUpload = async () => {
		if (!file) return;
		toggleAlert(null, '', true);

		const storage = getStorage(firebaseApp);
		const storageRef = ref(storage, `images/${file.name}`);

		// upload file to firebase storage
		try {
			await uploadBytes(storageRef, file);

			const url = await getDownloadURL(storageRef);

			const metadata: filePayload = {
				uploadName: file.name,
				url: url,
			};

			await axios.post(`${backendUrl}/uploads`, metadata, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			setFile(null);
		} catch (err) {
			console.error('error uploading file : ', err);
			toggleAlert(false, 'Upload error.', false);
		} finally {
			toggleAlert(true, 'Upload successful', false);
		}
	};

	return (
		<>
			<div className="tablet:w-3/4 flex items-center text-slate-200 font-medium mb-10 text-sm tablet:ml-0 ml-3 gap-3">
				<div className="relative h-fit bg-slate-800 px-3 py-2  rounded-md hover:cursor-pointer hover:opacity-70 duration-300 w-fit">
					<h1>Select Picture</h1>
					<input
						type="file"
						onChange={handleFileChange}
						className="absolute opacity-0 inset-0 hover:cursor-pointer w-full h-full"
						accept="image/*"
					/>
				</div>
				{file ? (
					<button onClick={handleUpload} className="bg-slate-800 rounded-md px-3 py-2">
						Save
					</button>
				) : (
					''
				)}
			</div>
		</>
	);
};

export default FileUpload;
