import React, {createContext, useContext, useEffect, useState} from 'react';
import images from '../assets/image';
import {DashboardContextType, DashboardTasksType, MainDashboardType} from './Types';
import axios from 'axios';
import {backendUrl} from './Login';
import {DashboardContext} from './Dashboard';
import FinishTask from './ui/FinishTask';
import {useNavigate} from 'react-router-dom';
import {ScrollArea} from './ui/scroll-area';
import {CalendarDemo} from './ui/CalendarUi';

export const MainDashboardContext = createContext<MainDashboardType | undefined>(undefined);

const MainDashboard: React.FC = () => {
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	const token: string | null = localStorage.getItem('token');
	const today = new Date();
	const unixTimeSeconds = Math.floor(today.getTime() / 1000);
	const [dashboardTasks, setDashboardTasks] = useState<DashboardTasksType[] | null>(null);

	const toggleCompleteDashboard = () => {
		fetchDashboardTasks();
	};

	const fetchDashboardTasks = async () => {
		try {
			toggleAlert(null, '', true);
			const response = await axios.get<DashboardTasksType[]>(`${backendUrl}/dashboardTasks`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200 && response.data) {
				setDashboardTasks(response.data);
				console.log('dashboard data from fetch : ', response.data);
			}
		} catch (err) {
			console.error('error getting tasks : ', err);
		} finally {
			toggleAlert(null, '', false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchDashboardTasks();
		}
	}, [token]);

	const navigate = useNavigate();

	const NavigateToTask = () => {
		navigate('/main/task');
	};

	return (
		<MainDashboardContext.Provider value={{toggleCompleteDashboard, dashboardTasks}}>
			<div className="bg-slate-100 px-6 py-4 text-base w-full h-screen">
				{/* top section */}
				<div className="flex gap-10">
					{/* My tasks */}
					<div className="w-1/3 bg-white rounded-lg shadow-sm h-auto">
						<div className="flex justify-between py-3 px-4 border-b-2 ">
							<h1 className="text-slate-900 font-medium text-lg tracking-wide">My Tasks</h1>

							<img src={images.moreGray} alt="" className="hover:cursor-pointer" onClick={NavigateToTask} />
						</div>

						<ScrollArea className="w-full bg-white rounded-lg shadow-sm h-auto">
							{dashboardTasks
								? dashboardTasks
										.filter((task) => task.status === null || task.status === true)
										.sort((a, b) => {
											const dateA = Math.abs(unixTimeSeconds - a.dueDate);
											const dateB = Math.abs(unixTimeSeconds - b.dueDate);

											return dateA - dateB;
										})
										.map((task: DashboardTasksType, index: number) => {
											const date = new Date(task.dueDate * 1000);

											const dateComa = new Intl.DateTimeFormat().format(date);

											return (
												<div className="py-2 px-4 border-b-2 flex justify-between items-center" key={index}>
													<div className="flex items-center gap-2">
														<div
															className={`w-3 h-3 rounded-sm ${
																(task.status ? 'bg-slate-500' : task.priority === 'high' && 'bg-red-500') ||
																(task.priority === 'medium' && 'bg-yellow-500') ||
																(task.priority === 'low' && 'bg-green-500')
															}`}
														></div>
														<h1 className={`text-base font-medium ${task.status ? 'text-slate-500' : ''}`}>{task.title}</h1>
													</div>

													<div className="flex items-center gap-2 font-normal">
														<h1 className="text-sm text-slate-500">{dateComa}</h1>
														<FinishTask
															taskID={task.taskID}
															dashboard={true}
															toggleComplete={toggleCompleteDashboard}
															status={task.status}
														/>
													</div>
												</div>
											);
										})
								: ''}
						</ScrollArea>
					</div>

					<div className="w-1/3 flex flex-col gap-4 h-full"></div>

					<div className="h-full">
						<CalendarDemo />
					</div>
				</div>

				{/* bottom section */}
				<div className="flex gap-10"></div>
			</div>
		</MainDashboardContext.Provider>
	);
};

export default MainDashboard;
