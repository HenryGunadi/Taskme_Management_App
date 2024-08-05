import axios from 'axios';
import {backendUrl} from './Login';
import {useContext, useEffect, useState} from 'react';
import {DashboardContextType, Task} from './Types';
import images from '../assets/image';
import {Link} from 'react-router-dom';
import {DashboardContext} from './Dashboard';

const Notification: React.FC = () => {
	const token = localStorage.getItem('token');
	const [dueDateTasks, setDueDateTasks] = useState<Task[]>([]);
	const {NotificationCtx} = useContext(DashboardContext) as DashboardContextType;

	const getDueDateTasks = async () => {
		if (token) {
			try {
				const response = await axios.get<Task[]>(`${backendUrl}/notification`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 200 && response.data) {
					console.log('email notifications : ', response.data);
					setDueDateTasks(response.data);
				}
			} catch (err) {
				console.error('error getting due date tasks : ', err);
			}
		}
	};

	useEffect(() => {
		if (token) {
			getDueDateTasks();
		}
	}, [token]);

	useEffect(() => {
		if (dueDateTasks.length > 0) {
			NotificationCtx.setIsNotification(true);
		} else {
			NotificationCtx.setIsNotification(false);
		}
	}, [dueDateTasks]);

	return (
		<div className="w-full laptop:px-6 px-3 py-4 font-medium">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">Task Management</h1>
				<h1 className=" text-slate-500">All tasks notifications are here.</h1>
			</div>

			<h1 className="text-xl font-semibold mb-4">
				Notifications <span className="text-slate-500">{dueDateTasks.length}</span>
			</h1>

			<div className="w-full flex flex-col text-sm items-center rounded-lg bg-white text-slate-500">
				<div className="w-full flex items-center bg-white py-3 laptop:px-4 px-3">
					<h1 className="w-2/6">Task</h1>
					<h1 className="w-2/6">Priority</h1>
					<h1 className="w-2/6">Due date</h1>
				</div>

				{dueDateTasks.length > 0
					? dueDateTasks.map((task: Task, index: number) => {
							const dateStr = new Date(task.dueDate * 1000);

							return (
								<div className="border-t-2 flex w-full items-center px-3 laptop:px-4 py-3 gap-2" key={index}>
									<div className="w-2/6">
										<h1 className="text-base">{task.title}</h1>
										<p className="text-xs">
											Heads up! Your task is due soon. Please check it out to ensure it's on track. <span className="text-red-500">*</span>
										</p>
									</div>

									<div className="w-2/6">
										<div
											className={`${
												(task.priority === 'high' && 'bg-red-100 text-red-500') ||
												(task.priority === 'medium' && 'bg-yellow-100 text-yellow-500') ||
												(task.priority === 'low' && 'bg-green-100 text-green-500')
											} font-medium px-2 py-1 rounded-lg w-fit`}
										>
											{task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLocaleLowerCase()}
										</div>
									</div>

									<div className="w-2/6 flex justify-between gap-2">
										<h1 className="w-1/4">{dateStr.toLocaleDateString()}</h1>
										<Link to="/main/task">
											<img src={images.moreGray} alt="" className="transitiion hover:opacity-50 hover:cursor-pointer" />
										</Link>
									</div>
								</div>
							);
					  })
					: ''}
			</div>
		</div>
	);
};

export default Notification;
