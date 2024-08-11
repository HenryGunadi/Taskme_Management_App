import {useNavigate, Link} from 'react-router-dom';
import images from '../assets/image';
import {handleLogout} from '../auth/Authentication';
import {CalendarDemo} from './ui/CalendarUi';
import {ScrollArea} from './ui/scroll-area';
import {useContext, useState} from 'react';
import {DashboardContext} from './Dashboard';
import {DashboardContextType, SidebarLinks} from './Types';

const Sidebar: React.FC = () => {
	const navigate = useNavigate();

	const {SidebarContext} = useContext(DashboardContext) as DashboardContextType;
	const [isSettings, setIsSettings] = useState<boolean>(false);

	const handleIsSettings = () => {
		setIsSettings((prev) => !prev);
	};

	const links: SidebarLinks[] = [
		{
			name: 'profile',
			link: '/main/user/profile',
		},
		{
			name: 'password',
			link: '/main/user/password',
		},
	];

	const handleSidebarAndSettings = () => {
		handleIsSettings();
		SidebarContext.handleIsSidebar();
	};

	const toProfileSettings: () => void = () => {
		const isMobbile: boolean = window.matchMedia('(max-width: 1020px)').matches;

		if (!isMobbile) {
			navigate('/main/user/profile');
			return;
		}
		return;
	};

	return (
		<div
			className={`z-50 laptop:z-0 fixed laptop:static flex-1 h-full tablet:w-3/12 flex flex-col font-medium w-3/4 bg-white ${
				SidebarContext.isSidebar ? 'left-0' : '-left-3/4'
			} laptop:left-0`}
		>
			<div className="laptop:px-6 w-full">
				<div className="h-16 flex items-center gap-2 px-3 laptop:px-0">
					<h1 className="text-2xl text-indigo-400 font-bold tracking-wider">TASKME</h1>
					<img src={images.target} alt="" className="w-8 h-auto object-cover " style={{imageRendering: 'auto'}} />
				</div>

				<div className="py-4 flex justify-center w-full">
					<CalendarDemo />
				</div>
			</div>

			<ScrollArea className="w-full">
				<Link to="/main/dashboard" onClick={SidebarContext.handleIsSidebar}>
					<div className="w-fit transition  py-2 tablet:px-6  px-3 hover:underline">
						<h1>Dashboard</h1>
					</div>
				</Link>

				<Link to="/main/task" onClick={SidebarContext.handleIsSidebar}>
					<div className="w-fit transition  py-2 tablet:px-6  px-3 hover:underline">
						<h1>Tasks</h1>
					</div>
				</Link>

				<Link to="/main/notification" onClick={SidebarContext.handleIsSidebar}>
					<div className="w-fit transition  py-2 tablet:px-6  px-3 hover:underline">
						<h1>Notification</h1>
					</div>
				</Link>

				<div className="w-full flex items-center gap-2 transition py-2 tablet:px-6 px-3 hover:underline">
					<h1 onClick={toProfileSettings} className="hover:cursor-pointer">
						Settings
					</h1>

					<img src={images.chevDown} alt="" className="w-5 laptop:hidden" onClick={handleIsSettings} />
				</div>

				{isSettings && (
					<div className="pr-3 pl-7">
						{links.map((link: SidebarLinks, index: number) => {
							return (
								<Link to={link.link} key={index} onClick={handleSidebarAndSettings}>
									<h1 className="py-1">{link.name}</h1>
								</Link>
							);
						})}
					</div>
				)}
			</ScrollArea>

			{/* logout */}
			<div className="py-4 w-fit hover:cursor-pointer gap-2 transition duration-150 hover:opacity-70 tablet:px-6 px-3 flex-1 flex items-end">
				<div
					className="flex items-center gap-1"
					onClick={() => {
						handleLogout(navigate);
					}}
				>
					<i className="fa-solid fa-right-from-bracket"></i>
					<h1 className="text-base font-medium">Logout</h1>
				</div>
			</div>

			<img
				src={SidebarContext.isSidebar ? images.doubleChevRightWhite : images.doubleChevRight}
				alt=""
				className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 opacity-70 laptop:hidden"
				onClick={SidebarContext.handleIsSidebar}
			/>
		</div>
	);
};

export default Sidebar;
