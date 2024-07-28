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
			console.log('file uploaded');

			const url = await getDownloadURL(storageRef);
			console.log('file downloaded');
			console.log('url : ', url);

			const metadata: filePayload = {
				uploadName: file.name,
				url: url,
			};

			console.log('metadata : ', metadata);

			const response = await axios.post(`${backendUrl}/uploads`, metadata, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			console.log(response.data);
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
			<div className="w-full flex items-center ml-4 text-slate-200 font-medium">
				<div className="relative h-fit bg-slate-800 px-4 py-2 rounded-md hover:cursor-pointer mr-4 hover:opacity-70 duration-100 ease-in">
					<h1>Select Picture</h1>
					<input
						type="file"
						onChange={handleFileChange}
						className="absolute opacity-0 inset-0 hover:cursor-pointer w-full h-full"
						accept="image/*"
					/>
				</div>
				{file ? (
					<button onClick={handleUpload} className="bg-slate-800 rounded-md px-4 py-2">
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
