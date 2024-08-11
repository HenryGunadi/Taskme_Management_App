import React, {createContext, useState, useEffect, ChangeEvent} from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {Route, Routes} from 'react-router-dom';
import UserProfile from './UserProfile';
import {backendUrl} from './Login';
import axios from 'axios';
import {DashboardContextType, AlertInterface, TaskDataInterface, TaskDataFetch, SidebarContext, NotificationContext} from './Types';
import {Alert, LinearProgress} from '@mui/material';
import MainDashboard from './MainDashboard';
import Task from './Task';
import AddTask from './ui/AddTask';
import Notification from './Notification';
import AddTaskButton from './ui/AddTaskButton';

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function getTimeDifference(unixtimestamp: number) {
	const now = Math.floor(Date.now() / 1000); // Current time in seconds
	let diffInSeconds = unixtimestamp - now;

	const days = Math.floor(diffInSeconds / (24 * 60 * 60));
	diffInSeconds -= days * 24 * 60 * 60; // Subtract the number of days in seconds

	const hours = Math.floor(diffInSeconds / (60 * 60));
	diffInSeconds -= hours * 60 * 60; // Subtract the number of hours in seconds

	const minutes = Math.floor(diffInSeconds / 60);

	return {days, hours, minutes};
}

const Dashboard: React.FC = () => {
	const token = localStorage.getItem('token');

	// fetch data
	const [imgFileUrl, setImgFileUrl] = useState<string>('');
	useEffect(() => {
		const fetchUserProfilePict = async () => {
			if (token) {
				try {
					const response = await axios.get(`${backendUrl}/fetchUploads`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (response.data.imgUrl) {
						const imgUrl = response.data.imgUrl;
						setImgFileUrl(imgUrl);
					}
				} catch (err) {
					console.error('error fetching user profile picture : ', err);
				}
			}
		};

		fetchUserProfilePict();
	}, [token]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (token) {
				try {
					const response = await axios.get(`${backendUrl}/user`, {
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					});
					if (response.status == 200 && response.data) {
						localStorage.setItem('firstName', response.data.firstName);
						localStorage.setItem('lastName', response.data.lastName);
						localStorage.setItem('email', response.data.email);
						localStorage.setItem('bio', response.data.bio);
					}
				} catch (err) {
					console.error('error fetching user data : ', err);
				}
			}
		};
		fetchUserData();
	}, [token]);

	// command ui
	const [isCommand, setIsCommand] = useState<boolean>(false);

	const toggleCommand = () => {
		setIsCommand((prev) => !prev);
	};

	const toggleOffCommand = () => {
		if (isCommand) {
			toggleCommand();
		}
	};

	// alert ui
	const [alert, setAlert] = useState<AlertInterface>({
		isLoading: false,
		isSuccess: null,
		alertMsg: '',
	});

	// alert
	useEffect(() => {
		if (alert.isSuccess == true || alert.isSuccess == false) {
			const alertDuration = setTimeout(() => {
				setAlert((prev) => ({
					...prev,
					isSuccess: null,
				}));
			}, 3000);

			return () => clearTimeout(alertDuration);
		}
	}, [alert]);

	const toggleAlert = (success: boolean | null, msg: string, loading: boolean) => {
		setAlert((prev) => ({
			...prev,
			isSuccess: success,
			isLoading: loading,
			alertMsg: msg,
		}));
	};

	// fetch user data

	// Add task overlay ui
	const [isAddTask, setIsAddTask] = useState<boolean>(false);
	const [priority, setPriority] = useState<string | null>(null);

	const toggleAddTask = (priority: string | null) => {
		setIsAddTask(true);
		setPriority(priority);
	};

	const toggleOffAddTask = () => {
		setIsAddTask(false);
		resetTask();
		setSubmitTask(false);
		setIsEdited(false);
	};

	// toggle off with esc key
	useEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				toggleOffAddTask();
			}
		};

		document.addEventListener('keydown', handleEscKey);

		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [toggleAddTask]);

	// add task
	const [submitTask, setSubmitTask] = useState<boolean>(false);
	const handleSetSubmitTask = () => {
		setSubmitTask((prev) => !prev);
	};

	const [task, setTask] = useState<TaskDataInterface>({
		title: '',
		description: '',
		priority: null,
		dueDate: -1,
		status: null,
	});
	const [_, setTime] = useState<TimeType>({
		day: -1,
		hour: -1,
		minute: -1,
	});

	const resetTask = () => {
		setTask({
			title: '',
			description: '',
			priority: null,
			dueDate: -1,
			status: null,
		});

		setSubmitTask(false);
	};

	const addTaskToServer = async () => {
		try {
			toggleAlert(null, '', true);
			const response = await axios.post(`${backendUrl}/task`, task, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				toggleAlert(true, 'Task added successfully.', false);
			}
		} catch (err) {
			toggleAlert(false, 'Adding task error.', false);
		} finally {
			toggleOffAddTask();
			resetTask();
		}
	};

	useEffect(() => {
		if (token && submitTask) {
			addTaskToServer();
			handleSetSubmitTask();
		}
	}, [submitTask, token]);

	const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setTask((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setTask((prev) => ({
			...prev,
			description: value,
		}));
	};

	const handlePopOver = (value: string) => {
		setTask((prev) => ({
			...prev,
			priority: value,
		}));
	};

	useEffect(() => {
		if (task.dueDate) {
			const {days, hours, minutes} = getTimeDifference(task.dueDate);
			setTime({
				day: days,
				hour: hours,
				minute: minutes,
			});
		}
	}, [task]);

	const handleCalendar = (value: number) => {
		setTask((prev) => ({
			...prev,
			dueDate: value,
		}));
	};

	type TimeType = {
		day: number;
		hour: number;
		minute: number;
	};

	// edit task
	const [isEdited, setIsEdited] = useState<boolean>(false);
	const [taskDesc, setTaskDesc] = useState<TaskDataFetch | null>(null);
	const toggleEdited = (data: TaskDataFetch) => {
		setIsEdited(true);
		setTaskDesc(data);
	};

	const toggleEditUi = () => {
		setIsEdited(false);
	};

	const [taskDetails, setTaskDetails] = useState<TaskDataFetch[] | null>(null);

	const handleSetTaskDetails = (data: TaskDataFetch[]) => {
		setTaskDetails(data);
	};

	const [edited, setEdited] = useState<boolean>(false);
	const toggleCheckEdited = (state: boolean) => {
		setEdited(state);
	};

	const [anyTaskChanges, setAnyTaskChanges] = useState<boolean>(false);

	const handleAnyTaskChanges = (state: boolean) => {
		if (state) {
			setAnyTaskChanges(true);
		} else {
			setAnyTaskChanges(false);
		}
	};

	const [isSidebars, setIsSidebar] = useState<boolean>(false);

	const handleIsSidebars = () => {
		setIsSidebar((prev) => !prev);
	};

	const SidebarContext: SidebarContext = {
		handleIsSidebar: handleIsSidebars,
		isSidebar: isSidebars,
	};

	const [isNotification, setIsNotification] = useState<boolean>(false);

	const NotificationCtx: NotificationContext = {
		isNotification: isNotification,
		setIsNotification: setIsNotification,
	};

	return (
		<DashboardContext.Provider
			value={{
				NotificationCtx,
				SidebarContext,
				anyTaskChanges,
				handleAnyTaskChanges,
				toggleEditUi,
				edited,
				toggleCheckEdited,
				taskDetails,
				toggleAlert,
				handleInputs,
				handlePopOver,
				handleCalendar,
				handleTextArea,
				submitTask,
				isCommand,
				toggleCommand,
				toggleOffCommand,
				toggleAddTask,
				imgFileUrl,
				task,
				priority,
				toggleOffAddTask,
				handleSetSubmitTask,
				handleSetTaskDetails,
				toggleEdited,
			}}
		>
			<div className="relative text-slate-950 bg-white flex w-screen h-screen box-border">
				<Sidebar />
				<div className="laptop:w-10/12 w-full flex flex-col bg-slate-100">
					<Navbar />

					<div className="flex flex-col overflow-x-hidden flex-1">
						<Routes>
							<Route path="/user/*" element={<UserProfile />} />
							<Route path="/dashboard" element={<MainDashboard />} />
							<Route path="/task" element={<Task />} />
							<Route path="/notification" element={<Notification />} />
						</Routes>
					</div>
				</div>

				{/* overlay effect command*/}
				<div
					className={`fixed inset-0 ${isSidebars ? 'bg-black opacity-50' : 'hidden'} w-full h-full laptop:hidden`}
					onClick={toggleOffCommand}
				></div>

				{/* alert ui */}
				{alert.isLoading === true && (
					<div className="fixed top-0 w-full z-10">
						<LinearProgress />
					</div>
				)}

				{/* alert ui */}
				{alert.isSuccess === true ? (
					<div className="fixed flex justify-center w-full mt-2">
						<Alert severity="success" className="">
							{alert.alertMsg}
						</Alert>
					</div>
				) : (
					alert.isSuccess === false && (
						<div className="fixed flex justify-center w-full mt-2">
							<Alert severity="error" className="">
								{alert.alertMsg}
							</Alert>
						</div>
					)
				)}

				{isAddTask && <AddTask data={null} />}

				{isEdited && <AddTask data={taskDesc && taskDesc} />}

				<AddTaskButton />
			</div>
		</DashboardContext.Provider>
	);
};

export default Dashboard;
