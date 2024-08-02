import React, {useContext} from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './alert-dialog';
import {Button} from './button';
import axios from 'axios';
import {backendUrl} from '../Login';
import {DashboardContext} from '../Dashboard';
import {DashboardContextType, FinishTaskType} from '../Types';

const FinishTask: React.FC<FinishTaskType> = ({taskID, dashboard, toggleComplete, status}) => {
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	const token = localStorage.getItem('token');

	const CompleteTask = async () => {
		if (token) {
			console.log('token from finish task : ', token);
			try {
				toggleAlert(null, '', true);
				const response = await axios.patch(
					`${backendUrl}/task/${taskID}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === 200) {
					console.log('task completed : ', response.status);
					toggleComplete();
				}
			} catch (err) {
				console.error('error updating task status : ', err);
				toggleAlert(false, 'Error completing task.', false);
			} finally {
				toggleAlert(null, '', false);
			}
		}
	};

	return (
		<AlertDialog>
			{dashboard && status ? (
				<i className="fa-solid fa-square-check text-green-500 text-lg"></i>
			) : (
				<AlertDialogTrigger asChild>
					{dashboard ? (
						<i
							className={`fa-solid fa-square-check hover:cursor-pointer transition hover:opacity-50 duration-200 text-lg ${
								status ? 'text-green-500' : 'text-slate-500'
							}`}
						></i>
					) : (
						<Button variant="outline">Done</Button>
					)}
				</AlertDialogTrigger>
			)}

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Complete task?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone, but you can still view completed tasks in the 'Completed' section.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={CompleteTask}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default FinishTask;
