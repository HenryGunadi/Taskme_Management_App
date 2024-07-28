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

import images from '../../assets/image';
import axios from 'axios';
import {backendUrl} from '../Login';
import {DashboardContextType, FinishTaskProps, TaskType} from '../Types';
import {useContext} from 'react';
import {DashboardContext} from '../Dashboard';
import {TaskContext} from '../Task';

const DeleteTask: React.FC<FinishTaskProps> = ({taskID}) => {
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;
	const {toggleDelete} = useContext(TaskContext) as TaskType;

	const token = localStorage.getItem('token');

	const deleteTask = async (taskID: string) => {
		if (token) {
			try {
				toggleAlert(null, '', true);
				const response = await axios.delete(`${backendUrl}/task/${taskID}`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.status === 200) {
					console.log('delete task response : ', response.data);
					toggleDelete();
				}
			} catch (err) {
				console.error('failed to delete task : ', err);
				toggleAlert(false, 'Error deleting task.', false);
			}
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<img src={images.trash} alt="" className="w-5 h-auto min-w-5 object-cover hover:cursor-pointer" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove task?</AlertDialogTitle>
					<AlertDialogDescription>
						Do you want to delete this task? It will be removed from your list, but you can add it back whenever you're ready.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteTask(taskID);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteTask;
