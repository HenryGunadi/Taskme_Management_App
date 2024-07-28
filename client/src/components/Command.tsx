import {useState, useContext} from 'react';
import images from '../assets/image';
import {DashboardContextType, Item} from './Types';
import {useNavigate} from 'react-router-dom';
import {DashboardContext} from './Dashboard';

const Command: React.FC = () => {
	// input value
	const [inputValue, setInputValue] = useState<string>('');

	// handle input value
	const hanldeInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	// items
	const items: Item[] = [
		{
			id: 1,
			route: 'task',
			name: 'Tasks',
			type: 'link',
		},
		{
			id: 2,
			route: 'dashboard',
			name: 'Dashboard',
			type: 'link',
		},
		{
			id: 3,
			route: 'in-progress',
			name: 'In-Progress',
			type: 'link',
		},
		{
			id: 4,
			route: 'completed',
			name: 'Completed',
			type: 'link',
		},
		{
			id: 5,
			route: 'trash',
			name: 'Trash',
			type: 'link',
		},
		{
			id: 6,
			route: 'user/profile',
			name: 'Profile',
			type: 'user',
		},
		{
			id: 7,
			route: 'user/password',
			name: 'Password',
			type: 'user',
		},
	];

	// filter items
	const filteredItems = items.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()));

	// react-router
	const navigate = useNavigate();
	const navigateTo = (location: string) => {
		navigate(`/main/${location}`);
	};

	// use context
	const {toggleCommand} = useContext(DashboardContext) as DashboardContextType;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="w-1/2 h-1/2 border border-slate-800 rounded-md flex flex-col z-50 bg-slate-50">
				{/* search bar */}
				<form action="" className="border-b border-slate-500 px-4 flex items-center w-full p-4">
					<img src={images.search} alt="" className="w-4 h-auto mr-4" />
					<input
						type="text"
						placeholder="Type a command or search..."
						className="bg-transparent w-1/2 outline-none"
						value={inputValue}
						onChange={hanldeInputValue}
					/>
				</form>
				<div className="p-4 overflow-auto">
					<div className="py-1">
						<h1 className="text-sm">Links</h1>
						{filteredItems
							.filter((item) => item.type === 'link')
							.map((item) => (
								<div
									key={item.id}
									className="py-3 px-2 flex hover:cursor-pointer hover:brightness-90 hover:bg-slate-50 rounded-md"
									onClick={() => {
										navigateTo(item.route);
										toggleCommand();
									}}
								>
									<img src={images.fileIcon} alt="" className="w-6 h-auto mr-2" />
									<h1 className="text-base">{item.name}</h1>
								</div>
							))}
					</div>

					<div className="py-1">
						<h1 className="text-sm">User</h1>
						{filteredItems
							.filter((item) => item.type === 'user')
							.map((item) => (
								<div
									key={item.id}
									className="hover:cursor-pointer py-3 px-2 flex hover:brightness-90 hover:bg-slate-50 rounded-md"
									onClick={() => {
										navigateTo(item.route);
										toggleCommand();
									}}
								>
									<img src={images.fileIcon} alt="" className="w-6 h-auto mr-2" />
									<h1 className="text-base">{item.name}</h1>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Command;
