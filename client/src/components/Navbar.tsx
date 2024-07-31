import images from '../assets/image';
import Command from './Command';
import React, {useContext, useEffect} from 'react';
import {DashboardContext} from './Dashboard';
import {useNavigate} from 'react-router-dom';
import {DashboardContextType} from './Types';

const Navbar: React.FC = () => {
	const {isCommand, toggleCommand, imgFileUrl} = useContext(DashboardContext) as DashboardContextType;

	const navigate = useNavigate();
	const navigateToUserSettings = () => {
		navigate('/main/user/profile');
	};

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isCommand) {
				toggleCommand();
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, [toggleCommand]);

	return (
		<>
			{/* navbar */}
			<div className="flex items-center justify-between h-16 px-6 w-full border  border-b-slate-300  bg-white">
				<div
					className="w-80 min-w-64 border border-slate-500 bg-slate-100 px-4 py-1 rounded-md hover:cursor-pointer"
					onClick={toggleCommand}
				>
					<p className="text-slate-500">Search here...</p>
				</div>

				<div className="flex gap-4">
					<div className="relative flex items-center">
						<img src={images.notification} alt="" className="w-5 min-w-5 h-auto" />
						<div className="w-2 min-w-2 h-2 p-1 flex justify-center items-center rounded-full bg-red-500 absolute top-1 text-xs text-white font-medium"></div>
					</div>

					<div className="flex items-center">
						<img
							src={!imgFileUrl ? '' : imgFileUrl}
							alt=""
							className="min-w-10 min-h-10 w-6 h-6 rounded-full bg-black object-cover object-center border border-black image-rendering-auto hover:cursor-pointer"
							onClick={navigateToUserSettings}
						/>
					</div>
				</div>
			</div>
			{/* command */}
			{isCommand ? <Command /> : ''}
		</>
	);
};

export default Navbar;
