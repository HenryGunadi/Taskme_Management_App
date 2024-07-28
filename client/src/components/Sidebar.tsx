import {useNavigate} from 'react-router-dom';
import images from '../assets/image';
import {handleLogout} from '../auth/Authentication';

const Sidebar: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="w-2/12 flex flex-col h-full text-base border-r-slate-300 border">
			<div className="h-14 px-6 flex items-center">
				<h1 className="text-2xl font-bold tracking-wider text-indigo-500">TASKME</h1>
			</div>

			<div className="px-6 py-8 flex-auto justify-between flex flex-col text-zinc-100 font-medium">
				<div></div>

				{/* logout */}
				<div className="flex items-center w-fit hover:cursor-pointer hover:scale-105 hover:opacity-80 ease-in-out duration-100">
					<h1 className="text-base font-medium">Logout</h1>
					<img
						onClick={() => {
							handleLogout(navigate);
						}}
						src={images.logOut}
						alt=""
						className="mx-4 w-6 h-auto min-w-6"
					/>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
