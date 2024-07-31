import axios from 'axios';
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
import {backendUrl} from '../Login';
import {useContext} from 'react';
import {DashboardContext} from '../Dashboard';
import {DailyTaskProps, DashboardContextType, MainDashboardType} from '../Types';
import {MainDashboardContext} from '../MainDashboard';

type DeleteDailyTaskType = {
	taskID: string;
};

const DeleteDailyTask: React.FC<DeleteDailyTaskType> = ({taskID}) => {
	const token = localStorage.getItem('token');
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;
	const {handleIsAddedOrDeletedOrCompleted} = useContext(MainDashboardContext) as MainDashboardType;

	const handleDeleteDailyTask = async () => {
		if (token) {
			toggleAlert(null, '', true);
			try {
				const response = await axios.delete(`${backendUrl}/task/daily/${taskID}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 200 && response.data) {
					console.log('delete daily task status : ', response.data);
					toggleAlert(true, 'Task Deleted.', false);
					const action: DailyTaskProps = {
						added: false,
						deleted: true,
						completed: false,
					};
					handleIsAddedOrDeletedOrCompleted(action);
				}
			} catch (err) {
				console.error('error deleting daily task : ', err);
				toggleAlert(null, 'Error Deleting Task.', false);
			}
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<i className="fa-solid fa-trash-can text-lg text-slate-500 hover:cursor-pointer hover:opacity-50 transition duration-200"></i>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove daily task?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteDailyTask}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDailyTask;
