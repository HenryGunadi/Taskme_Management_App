import images from '../assets/image';
import Command from './Command';
import React, {useContext, useEffect} from 'react';
import {DashboardContext} from './Dashboard';
import {Link, useNavigate} from 'react-router-dom';
import {DashboardContextType} from './Types';

const Navbar: React.FC = () => {
	const {isCommand, toggleCommand, imgFileUrl, NotificationCtx} = useContext(DashboardContext) as DashboardContextType;

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
			<div className="flex items-center tablet:justify-between h-16 tablet:px-6 px-3 w-full border border-b-slate-300  bg-white">
				<div className="flex gap-2 tablet:hidden">
					<div className="flex items-center">
						<img
							src={!imgFileUrl ? '' : imgFileUrl}
							alt=""
							className="w-9 h-9 rounded-full bg-black object-cover object-center border border-black image-rendering-auto hover:cursor-pointer"
							onClick={navigateToUserSettings}
						/>
					</div>

					<div className="relative flex items-center mr-2">
						<Link to={'/main/notification'}>
							<img src={images.notification} alt="" className="w-5 min-w-5 h-auto" />
						</Link>
						{NotificationCtx.isNotification && (
							<div className="w-2 min-w-2 h-2 p-1 flex justify-center items-center rounded-full bg-red-500 absolute top-1 text-xs text-white font-medium"></div>
						)}
					</div>
				</div>

				<div
					className="w-60 tablet:w-80 border border-slate-500 bg-slate-100 px-2 tablet:px-4 py-1 rounded-md hover:cursor-pointer"
					onClick={toggleCommand}
				>
					<p className="text-slate-500">Search here...</p>
				</div>

				<div className="tablet:flex gap-4 hidden">
					<div className="relative flex items-center">
						<Link to={'/main/notification'}>
							<img src={images.notification} alt="" className="w-5 min-w-5 h-auto" />
						</Link>
						{NotificationCtx.isNotification && (
							<div className="w-2 min-w-2 h-2 p-1 flex justify-center items-center rounded-full bg-red-500 absolute top-1 text-xs text-white font-medium"></div>
						)}
					</div>

					<div className="flex items-center">
						<img
							src={!imgFileUrl ? '' : imgFileUrl}
							alt=""
							className="w-10 h-10 rounded-full bg-black object-cover object-center border border-black image-rendering-auto hover:cursor-pointer"
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
