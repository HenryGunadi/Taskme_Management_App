import React, {useContext, useEffect, useState} from 'react';
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
			try {
				const response = await axios.get<TaskDataFetch[]>(`${backendUrl}/task`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.status === 200) {
					handleSetTaskDetails(response.data);
				}
			} catch (err) {
				console.error('fetching user task details error : ', err);
			}
		}
	};

	useEffect(() => {
		if (token) {
			fetchTaskData();
		}
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

	const [dropwDown, setDropDown] = useState<boolean>(false);

	const handleDropDown = () => {
		setDropDown((prev) => !prev);
	};

	const [isPriority, setIsPriority] = useState<string>('highMb');

	const checkPriority = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.currentTarget as HTMLDivElement;
		const id = target.id;

		setIsPriority(id);
		handleDropDown();
	};

	return (
		<>
			<TaskContext.Provider value={{toggleDelete, toggleComplete, isCompleted}}>
				<div className="flex flex-1 px-4 tablet:px-6 text-base py-4 gap-8">
					{/* mobile */}
					<div className="w-full tablet:hidden">
						<div className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit ">
							<div className="flex items-center">
								<i
									className={`fa-solid fa-circle text-xs ${
										(isPriority === 'highMb' && 'text-red-500') ||
										(isPriority === 'mediumMb' && 'text-yellow-500') ||
										(isPriority === 'lowMb' && 'text-green-500')
									}`}
								></i>
								<h1 className="font-semibold text-base px-2">
									{(isPriority === 'highMb' && 'High') || (isPriority === 'mediumMb' && 'Medium') || (isPriority === 'lowMb' && 'Low')}
								</h1>

								<div className="relative w-fit h-fit">
									{dropwDown && (
										<div className="flex flex-col gap-2 absolute top-full z-50 bg-white rounded-lg shadow-sm px-4 py-2 border text-sm h-fit">
											<div className="flex w-full gap-2 items-center" id="highMb" onClick={checkPriority}>
												<i className="fa-regular fa-solid fa-circle text-xs text-red-500"></i>

												<h4>High</h4>
											</div>
											<div className="flex w-full gap-2 items-center" id="mediumMb" onClick={checkPriority}>
												<i className="fa-regular fa-circle text-xs fa-solid text-yellow-500"></i>

												<h4>Medium</h4>
											</div>
											<div className="flex w-full gap-2 items-center" id="lowMb" onClick={checkPriority}>
												<i className="fa-regular fa-circle text-xs fa-solid text-green-500"></i>

												<h4>Low</h4>
											</div>
										</div>
									)}

									<i className="fa-solid fa-chevron-down transition text-slate-500" onClick={handleDropDown}></i>
								</div>
							</div>

							<i
								className="fa-solid fa-square-plus text-xl text-slate-500"
								onClick={() => {
									toggleAddTask('high');
								}}
							></i>
						</div>

						{isPriority === 'highMb' &&
							taskDetails &&
							taskDetails
								.filter((task) => task.priority === 'high' && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}

						{isPriority === 'mediumMb' &&
							taskDetails &&
							taskDetails
								.filter((task) => task.priority === 'medium' && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}

						{isPriority === 'lowMb' &&
							taskDetails &&
							taskDetails
								.filter((task) => (task.priority === 'low' || task.priority === null) && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>

					{/* high */}
					<div className="w-1/3 hidden tablet:block" id="high">
						<div className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit">
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-red-500 text-xs"></i>
								<h1 className="font-semibold text-sm px-2">High</h1>
							</div>

							<i
								className="fa-solid fa-plus text-base text-slate transition duration-300 hover:cursor-pointer hover:opacity-50 text-slate-500"
								onClick={() => {
									toggleAddTask('high');
								}}
							></i>
						</div>

						{taskDetails &&
							taskDetails
								.filter((task) => task.priority === 'high' && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>

					{/* medium */}
					<div className="w-1/3 hidden tablet:block" id="medium">
						<div className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit">
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-yellow-500 text-xs"></i>
								<h1 className="font-semibold text-sm px-2">Medium</h1>
							</div>

							<i
								className="fa-solid fa-plus text-base transition hover:opacity-50 hover:cursor-pointer duration-300 text-slate-500"
								onClick={() => {
									toggleAddTask('high');
								}}
							></i>
						</div>

						{taskDetails &&
							taskDetails
								.filter((task) => task.priority === 'medium' && task.status !== true)
								.sort((a, b) => {
									const dateA = Math.abs(unixTimeSeconds - a.dueDate);
									const dateB = Math.abs(unixTimeSeconds - b.dueDate);

									return dateA - dateB;
								})
								.map((task: TaskDataFetch, index: number) => <TaskContainer key={index} data={task} />)}
					</div>

					{/* low */}
					<div className="w-1/3 hidden tablet:block" id="low">
						<div className="w-full shadow-sm flex justify-between px-4 py-2 rounded-lg items-center bg-white h-fit">
							<div className="flex items-center">
								<i className="fa-solid fa-circle text-green-500 text-xs"></i>
								<h1 className="font-semibold text-sm px-2">Low</h1>
							</div>

							<i
								className="fa-solid fa-plus text-base transition hover:opacity-50 hover:cursor-pointer duration-300 text-slate-500"
								onClick={() => {
									toggleAddTask('low');
								}}
							></i>
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
