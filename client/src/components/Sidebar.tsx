import {useNavigate} from 'react-router-dom';
import images from '../assets/image';
import {handleLogout} from '../auth/Authentication';
import {CalendarDemo} from './ui/CalendarUi';

const Sidebar: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="justify-between w-3/12 px-6 flex-auto flex flex-col font-medium">
			<div>
				<div className="h-16 flex items-center gap-2">
					<h1 className="text-2xl text-indigo-400 font-bold tracking-wider">TASKME</h1>
					<img src={images.target} alt="" className="w-8 h-auto object-cover " style={{imageRendering: 'auto'}} />
				</div>

				<div className="py-4">
					<CalendarDemo />
				</div>
			</div>

			{/* logout */}
			<div className="py-4 flex items-center w-fit hover:cursor-pointer gap-2 transition duration-150 hover:opacity-70">
				<i
					className="fa-solid fa-right-from-bracket"
					onClick={() => {
						handleLogout(navigate);
					}}
				></i>
				<h1 className="text-base font-medium">Logout</h1>
			</div>
		</div>
	);
};

export default Sidebar;
