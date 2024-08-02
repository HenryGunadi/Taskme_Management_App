import {useNavigate, Link} from 'react-router-dom';
import images from '../assets/image';
import {handleLogout} from '../auth/Authentication';
import {CalendarDemo} from './ui/CalendarUi';
import {ScrollArea} from './ui/scroll-area';

const Sidebar: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="justify-between w-3/12 flex-auto flex flex-col font-medium">
			<div className="px-6">
				<div className="h-16 flex items-center gap-2">
					<h1 className="text-2xl text-indigo-400 font-bold tracking-wider">TASKME</h1>
					<img src={images.target} alt="" className="w-8 h-auto object-cover " style={{imageRendering: 'auto'}} />
				</div>

				<div className="py-4 flex w-full justify-center">
					<CalendarDemo />
				</div>
			</div>

			<ScrollArea className="w-full ">
				<Link to="/main/dashboard">
					<div className="w-full transition  py-2 px-6  hover:underline">
						<h1>Dashboard</h1>
					</div>
				</Link>

				<Link to="/main/task">
					<div className="w-full transition  py-2 px-6  hover:underline">
						<h1>Tasks</h1>
					</div>
				</Link>

				<Link to="/main/notification">
					<div className="w-full transition  py-2 px-6  hover:underline">
						<h1>Notification</h1>
					</div>
				</Link>

				<Link to="/main/user/profile">
					<div className="w-full transition py-2 px-6  hover:underline">
						<h1>Settings</h1>
					</div>
				</Link>
			</ScrollArea>

			{/* logout */}
			<div
				className="py-4 flex items-center w-fit hover:cursor-pointer gap-2 transition duration-150 hover:opacity-70 px-6"
				onClick={() => {
					handleLogout(navigate);
				}}
			>
				<i className="fa-solid fa-right-from-bracket"></i>
				<h1 className="text-base font-medium">Logout</h1>
			</div>
		</div>
	);
};

export default Sidebar;
