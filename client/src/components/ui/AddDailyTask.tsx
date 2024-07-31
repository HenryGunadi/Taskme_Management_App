import React, {useContext, useState} from 'react';
import images from '../../assets/image';
import {Button} from './button';
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from './dialog';
import TimePicker from './TimePicker';
import SelectUi from './SelectUi';
import axios from 'axios';
import {backendUrl} from '../Login';
import {MainDashboardContext} from '../MainDashboard';
import {DailyTaskProps, DashboardContextType, MainDashboardType} from '../Types';
import {DashboardContext} from '../Dashboard';

const AddDailyTask: React.FC = () => {
	const token: string | null = localStorage.getItem('token');

	const {dailyTasks, handleSetDailyTask, handleIsAddedOrDeletedOrCompleted} = useContext(MainDashboardContext) as MainDashboardType;
	const {toggleAlert} = useContext(DashboardContext) as DashboardContextType;

	const [isOpen, setIsOpen] = useState<boolean>(false);

	// add daily task
	const addDailyTask = async () => {
		if (token) {
			toggleAlert(null, '', true);
			try {
				const response = await axios.post(`${backendUrl}/task/daily`, dailyTasks, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 200 && response.data) {
					console.log('daily task : ', response.data);
					const action: DailyTaskProps = {
						added: true,
						deleted: false,
						completed: false,
					};
					handleIsAddedOrDeletedOrCompleted(action);
					setIsOpen(false);
					toggleAlert(true, 'Daily task added.', false);
				}
			} catch (err) {
				console.error('error adding daily task : ', err);
				toggleAlert(false, 'Error adding task.', false);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<img src={images.plus} alt="" className="hover:cursor-pointer w-5 transition hover:opacity-70 duration-100" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
				</DialogHeader>

				<div className="flex items-center mb-4">
					<h1 className="font-medium w-1/5 text-base text-end">Task</h1>
					<input
						type="text"
						id="task"
						name="task"
						className="bg-slate-100 outline-none border border-slate-600 rounded-md px-4 py-2 w-4/5 ml-4"
						onChange={handleSetDailyTask}
					/>
				</div>

				<div className="flex items-center mb-4">
					<h1 className="font-medium w-1/5 text-end mr-3">Set Time</h1>

					<TimePicker />
				</div>

				<div className="flex items-center gap-3 mb-4">
					<h1 className="font-medium w-1/5 text-base text-end">Category</h1>
					<SelectUi />
				</div>

				<DialogFooter>
					<Button type="submit" className="bg-green-500" onClick={addDailyTask}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddDailyTask;
