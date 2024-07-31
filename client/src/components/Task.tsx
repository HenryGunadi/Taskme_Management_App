import React, {useContext, useEffect, useState} from 'react';
import images from '../assets/image';
import {DashboardContextType, TaskDataFetch, TaskType} from './Types';
import {DashboardContext} from './Dashboard';
import axios from 'axios';
import {backendUrl} from './Login';
import TaskContainer from './subComponents/TaskContainer';
import {createContext} from 'react';

export const TaskContext = createContext<TaskType | undefined>(undefined);

const Task: React.FC = () => {
	const {handleAnyTaskChanges, toggleAddTask, toggleAlert, submitTask, handleSetTaskDetails, taskDetails, edited, toggleCheckEdited} =
		useContext(DashboardContext) as DashboardContextType;
	const token = localStorage.getItem('token');

	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);

	const today = new Date();
	const unixTimeSeconds = Math.floor(today.getTime() / 1000);

	useEffect(() => {
		const trues = isDeleted || isCompleted;
		handleAnyTaskChanges(trues);
	}, [isDeleted, isCompleted]);

	const toggleDelete = () => {
		setIsDeleted(true);
	};

	const toggleComplete = () => {
		setIsCompleted(true);
	};

	const fetchTaskData = async () => {
		if (token) {
			toggleAlert(null, '', true);
			try {
				const response = await axios.get<TaskDataFetch[]>(`${backendUrl}/task`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.status === 200) {
					console.log('task details : ', response.data);
					handleSetTaskDetails(response.data);
				}
			} catch (err) {
				console.error('fetching user task details error : ', err);
			} finally {
				toggleAlert(null, '', false);
			}
		}
	};

	useEffect(() => {
		fetchTaskData();
	}, [token, submitTask]);

	const reFetchData = async () => {
		if (isDeleted) {
			await fetchTaskData();
			setIsDeleted(false);
			toggleAlert(true, 'Task deleted.', false);
		} else if (isCompleted) {
			await fetchTaskData();
			setIsCompleted(false);
			toggleAlert(true, 'Task completed.', false);
		} else if (edited) {
			await fetchTaskData();
			toggleCheckEdited(false);
			toggleAlert(true, 'Task updated.', false);
		}
	};

	useEffect(() => {
		reFetchData();
	}, [toggleDelete, toggleComplete, toggleCheckEdited]);

	return (
		<>
			<TaskContext.Provider value={{toggleDelete, toggleComplete, isCompleted}}>
				<div className="flex flex-1 px-6 text-base py-4 gap-8">
					{/* high */}
					<div className="w-1/3" id="high">
						<div
							className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit hover:cursor-pointer transition transform hover:-translate-y-1"
							onClick={() => {
								toggleAddTask('high');
							}}
						>
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-red-500 text-xs"></i>
								<h1 className="font-semibold text-base px-2">High</h1>
							</div>

							<i className="fa-solid fa-square-plus text-xl"></i>
						</div>

						{taskDetails &&
							taskDetails
								.filter((task) => (task.priority === 'high' || task.priority === null) && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>

					{/* medium */}
					<div className="w-1/3" id="medium">
						<div
							className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit  hover:cursor-pointer transition transform hover:-translate-y-1"
							onClick={() => {
								toggleAddTask('medium');
							}}
						>
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-yellow-500 text-xs"></i>
								<h1 className="font-semibold text-base px-2">Medium</h1>
							</div>

							<i className="fa-solid fa-square-plus text-xl"></i>
						</div>

						{taskDetails &&
							taskDetails
								.filter((task) => (task.priority === 'medium' || task.priority === null) && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>

					{/* low */}
					<div className="w-1/3" id="low">
						<div
							className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit  hover:cursor-pointer transition transform hover:-translate-y-1"
							onClick={() => {
								toggleAddTask('low');
							}}
						>
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-green-500 text-xs"></i>
								<h1 className="font-semibold text-base px-2">Low</h1>
							</div>

							<i className="fa-solid fa-square-plus text-xl"></i>
						</div>

						{taskDetails &&
							taskDetails
								.filter((task) => (task.priority === 'low' || task.priority === null) && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>
				</div>
			</TaskContext.Provider>
		</>
	);
};

export default Task;
