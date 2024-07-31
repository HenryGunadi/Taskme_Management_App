import React, {createContext, useContext, useEffect, useState} from 'react';
import images from '../assets/image';
import {DailyTaskProps, DailyTasksFetchType, DailyTasksType, DashboardContextType, DashboardTasksType, MainDashboardType} from './Types';
import axios from 'axios';
import {backendUrl} from './Login';
import {DashboardContext} from './Dashboard';
import FinishTask from './ui/FinishTask';
import {useNavigate} from 'react-router-dom';
import {ScrollArea} from './ui/scroll-area';
import AddDailyTask from './ui/AddDailyTask';
import FinishDailyTask from './ui/FinishDailyTask';
import DeleteDailyTask from './ui/DeleteDailyTask';

export const MainDashboardContext = createContext<MainDashboardType | undefined>(undefined);

const MainDashboard: React.FC = () => {
	const firstName: string = localStorage.getItem('firstName') ?? '';
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

	const [displayMsg, setDisplayMsg] = useState<string | null>(null);
	useEffect(() => {
		const time: string[] = new Date().toLocaleTimeString().split(':');
		console.log('time array : ', time);
		const amOrPm: string | undefined = time.find((msg) => msg.includes('AM') || msg.includes('PM'));
		console.log('AM OR PM : ', amOrPm);
		if (amOrPm?.includes('AM')) {
			setDisplayMsg('Good morning,');
		} else if (amOrPm?.includes('PM') && parseInt(time[0]) >= 0 && parseInt(time[0]) <= 18) {
			setDisplayMsg('Good afternoon,');
		} else if (amOrPm?.includes('PM') && parseInt(time[0]) >= 18 && parseInt(time[0]) <= 21) {
			setDisplayMsg('Good evening,');
		} else {
			setDisplayMsg('Good night,');
		}
	}, []);

	const [dailyTasks, setDailyTasks] = useState<DailyTasksType>({
		task: '',
		status: false,
		time: {
			hour: 0,
			minute: 0,
		},
		category: 'else',
	});

	const handleSetDailyTask = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setDailyTasks((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleDailyTaskTime = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setDailyTasks((prev) => {
			if (!prev.time) {
				prev.time = {
					hour: 0,
					minute: 0,
				};
			}

			return {
				...prev,
				time: {
					...prev.time,
					[name]: Number(value) || 0,
				},
			};
		});
	};

	const handleDailyTaskCategory = (value: string) => {
		setDailyTasks((prev) => ({
			...prev,
			category: value,
		}));
	};

	useEffect(() => {
		console.log('daily Tasks : ', dailyTasks);
	}, [dailyTasks]);

	// fetch daily tasks
	const [dailyTaskFetch, setDailyTasksFetch] = useState<DailyTasksFetchType[]>([]);
	const [dailyTaskAction, setDailyTaskAction] = useState<DailyTaskProps>({
		added: false,
		deleted: false,
		completed: false,
	});

	const handleIsAddedOrDeletedOrCompleted = (action: DailyTaskProps) => {
		if (action.added) {
			setDailyTaskAction((prev) => ({
				...prev,
				added: true,
			}));
		} else if (action.deleted) {
			setDailyTaskAction((prev) => ({
				...prev,
				deleted: true,
			}));
		} else if (action.completed) {
			setDailyTaskAction((prev) => ({
				...prev,
				completed: true,
			}));
		}
	};

	const fetchDailyTask = async () => {
		try {
			const response = await axios.get<DailyTasksFetchType[]>(`${backendUrl}/task/daily`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200 && response.data) {
				console.log('daily tasks fetched : ', response.data);
				setDailyTasksFetch(response.data);
			}
		} catch (err) {
			console.error('error fetching daily tasks : ', err);
		}
	};

	useEffect(() => {
		const isAnyActionTrue = Object.values(dailyTaskAction).some((value) => value);

		if (token && isAnyActionTrue) {
			fetchDailyTask();
			setDailyTaskAction({
				added: false,
				deleted: false,
				completed: false,
			});
		}
	}, [token, dailyTaskAction]);

	return (
		<MainDashboardContext.Provider
			value={{
				handleDailyTaskTime,
				toggleCompleteDashboard,
				dashboardTasks,
				handleSetDailyTask,
				handleDailyTaskCategory,
				dailyTasks,
				handleIsAddedOrDeletedOrCompleted,
				dailyTaskFetch,
			}}
		>
			<div className="bg-slate-100 px-6 py-4 text-base w-full h-auto">
				<div className="mb-10">
					<h1 className="font-bold text-2xl text-slate-800 pb-2">{`${displayMsg} ${firstName} ! 😊 `}</h1>
					<p className="text-slate-500 font-medium">Welcome back</p>
				</div>

				<div className="flex gap-10 w-1/3 flex-col">
					{/* To dos */}
					<div className="w-full bg-white rounded-lg shadow-sm h-1/2">
						<div className="flex justify-between py-4 px-4">
							<h1 className="text-slate-900 font-medium text-base">To-dos</h1>

							<img
								src={images.moreGray}
								alt=""
								className="hover:cursor-pointer w-5 transition hover:opacity-70 duration-100"
								onClick={NavigateToTask}
							/>
						</div>

						<ScrollArea className="w-full bg-white rounded-lg">
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
												<div className="py-4 px-4 border-t-2 flex justify-between items-center" key={index}>
													<div className="flex items-center gap-2">
														<div
															className={`w-3 h-3 rounded-sm ${
																(task.status ? 'bg-slate-500' : task.priority === 'high' && 'bg-red-500') ||
																(task.priority === 'medium' && 'bg-yellow-500') ||
																(task.priority === 'low' && 'bg-green-500')
															}`}
														></div>
														<h1 className={`text-sm font-medium ${task.status ? 'text-slate-500' : ''}`}>{task.title}</h1>
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

					{/* Daily tasks */}
					<div className="w-full bg-white rounded-lg shadow-sm h-1/2">
						<div className="flex justify-between py-4 px-4">
							<h1 className="text-slate-900 font-medium text-base">Daily Tasks</h1>

							<AddDailyTask />
						</div>

						{!dailyTasks && (
							<div className="text-sm p-4">
								<p>
									You have no daily tasks... <span className="text-lg">😴</span>
								</p>
							</div>
						)}

						{dailyTaskFetch && dailyTaskFetch.length > 0
							? dailyTaskFetch
									.sort((a: DailyTasksFetchType, b: DailyTasksFetchType) => {
										const timeA = a.time.hour * 60 + a.time.minute;
										const timeB = b.time.hour * 60 + b.time.minute;

										return timeA - timeB;
									})
									.map((task: DailyTasksFetchType, index: number) => {
										return (
											<div className="text-sm p-4 flex justify-between items-center border-t-2" key={index}>
												<div className="flex items-center">
													<div className="w-10">
														<i
															className={`fa-solid ${
																(task.category === 'health' && 'fa-dumbbel') ||
																(task.category === 'study' && 'fa-book') ||
																(task.category === 'work' && 'fa-briefcase') ||
																(task.category === 'finance' && 'fa-money-bill') ||
																(task.category === 'food' && 'fa-utensils') ||
																(task.category === 'familyTime' && 'fa-people-roof') ||
																'fa-list-check'
															} text-indigo-500 text-xl text-center`}
														></i>
													</div>

													<div className="font-medium">
														<h1>{task.task}</h1>
														{task.time.hour !== undefined && (
															<h1 className="text-xs">{`${task.time.hour < 10 ? '0' + String(task.time.hour) : String(task.time.hour)} : ${
																task.time.minute < 10 ? '0' + String(task.time.minute) : String(task.time.minute)
															} ${(task.time.hour > 12 && 'PM') || (task.time.hour > 12 && task.time.minute > 0 && 'PM') || 'AM'}`}</h1>
														)}
													</div>
												</div>

												<div className="flex items-center gap-2">
													<DeleteDailyTask taskID={task.taskID} />
													<FinishDailyTask taskID={task.taskID} task={task} />
												</div>
											</div>
										);
									})
							: ''}
					</div>
				</div>

				<div className="flex gap-10"></div>
			</div>
		</MainDashboardContext.Provider>
	);
};

export default MainDashboard;
