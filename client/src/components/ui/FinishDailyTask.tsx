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
import {DailyTaskProps, DashboardContextType, FinishDailyTaskType, MainDashboardType} from '../Types';
import {useContext} from 'react';
import {MainDashboardContext} from '../MainDashboard';
import {DashboardContext} from '../Dashboard';

const FinishDailyTask: React.FC<FinishDailyTaskType> = ({taskID, task}) => {
	const token = localStorage.getItem('token');
	const {handleIsAddedOrDeletedOrCompleted} = useContext(MainDashboardContext) as MainDashboardType;
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	const completeDailyTask = async () => {
		if (token) {
			toggleAlert(null, '', true);
			try {
				const response = await axios.patch(
					`${backendUrl}/task/daily/${taskID}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === 200 && response.data) {
					console.log('complete daily task response : ', response.data);
					const action: DailyTaskProps = {
						added: false,
						deleted: false,
						completed: true,
					};
					handleIsAddedOrDeletedOrCompleted(action);
					toggleAlert(true, 'Daily task completed.', false);
				}
			} catch (err) {
				console.error('error completing daily task : ', err);
				toggleAlert(false, 'Error completing daily task.', false);
			}
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{task.status === true ? (
					<i className="fa-solid text-lg fa-square-check text-green-500"></i>
				) : (
					<i className="fa-solid text-lg fa-square-check text-slate-500 transition hover:opacity-50 duration-200 hover:cursor-pointer"></i>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Complete daily task?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone, but you can still view completed tasks in the 'Completed' section.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={completeDailyTask}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default FinishDailyTask;
