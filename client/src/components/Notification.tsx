import axios from 'axios';
import {backendUrl} from './Login';
import {useState} from 'react';

const Notification: React.FC = () => {
	const token = localStorage.getItem('token');

	const getDueDateTasks = async () => {
		if (token) {
			try {
				const response = await axios.get(`${backendUrl}/notification`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 200 && response.data) {
					console.log('email notifications : ', response.data);
				}
			} catch (err) {
				console.error('error getting due date tasks : ', err);
			}
		}
	};

	return (
		<div className="w-full px-6 py-4 font-medium">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">Task Management</h1>
				<h1 className=" text-slate-500">All tasks notifications are here.</h1>
			</div>

			<h1 className="text-xl font-semibold mb-4">Notifications</h1>

			<div className="w-full flex text-sm items-center rounded-lg bg-white py-2 px-4 text-slate-500">
				<h1 className="w-2/4">Task</h1>
				<h1 className="w-1/4">Priority</h1>
				<h1 className="w-1/4">Due date</h1>
			</div>
		</div>
	);
};

export default Notification;
