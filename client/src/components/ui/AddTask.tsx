import images from '../../assets/image';
import ComboboxPopover from './PopOverUi';
import DatePickerDemo from './DatePicker';
import React, {ChangeEvent, useContext, useState} from 'react';
import {DashboardContext} from '../Dashboard';
import {AddTaskContextType, DashboardContextType, TaskDataFetch} from '../Types';
import axios from 'axios';
import {backendUrl} from '../Login';
import {createContext} from 'react';

export const AddTaskContext = createContext<AddTaskContextType | undefined>(undefined);

const AddTask: React.FC<{data: TaskDataFetch | null}> = ({data}) => {
	const token = localStorage.getItem('token');

	const {toggleOffAddTask, task, handleInputs, handleTextArea, priority, handleSetSubmitTask, toggleCheckEdited, toggleEditUi} = useContext(
		DashboardContext
	) as DashboardContextType;

	const [datas, setDatas] = useState<TaskDataFetch | null>(data);

	const handleCalendarUpdate = (value: number) => {
		setDatas((prev) => {
			if (!prev) {
				return null;
			}

			return {
				...prev,
				dueDate: value,
			};
		});
	};

	const handleInputss = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setDatas((prev) => {
			if (!prev) {
				return null;
			}

			return {
				...prev,
				[name]: value,
			};
		});
	};

	const handlePriority = (value: string) => {
		setDatas((prev) => {
			if (!prev) {
				return null;
			}

			if (value === '') {
				return {
					...prev,
					priority: 'low',
				};
			}

			return {
				...prev,
				priority: value,
			};
		});
	};

	const updateTask = async () => {
		if (token) {
			try {
				const taskID = data?.taskID;
				const response = await axios.patch(`${backendUrl}/task/update/${taskID}`, datas, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
			} catch (err) {
				console.error('error updating task : ', err);
			}
		}
	};

	const handleEditTask = () => {
		updateTask();
		toggleCheckEdited(true);
		toggleEditUi();
	};

	return (
		<AddTaskContext.Provider value={{handleCalendarUpdate, handlePriority}}>
			<div className="fixed flex z-50 bg-black bg-opacity-50 justify-center items-center inset-0">
				<div className="bg-white rounded-lg border-slate-800 border p-6 overflow-y-auto flex flex-col tablet:w-1/3 h-3/4 w-full mx-4">
					<div className="w-full flex justify-end">
						<img src={images.xIcon} alt="" className="hover:cursor-pointer" onClick={toggleOffAddTask} />
					</div>

					<label htmlFor="title" className="block font-medium">
						Title
					</label>
					<input
						type="text"
						id="title"
						value={data && datas ? datas.title : task.title}
						onChange={data ? handleInputss : handleInputs}
						name="title"
						className="border border-slate-600 outline-none w-full bg-slate-100 rounded-md laptop:py-2 laptop:px-4 px-3 py-1 text-sm mt-1 mb-4"
						required
					/>

					<label htmlFor="taskDesc" className="font-medium">
						Description
					</label>
					<textarea
						name="description"
						id="taskDesc"
						className="border border-slate-600 outline-none w-full bg-slate-100 rounded-md tablet:py-2 tablet:px-4 px-3 py-1 text-sm mt-1 mb-4 laptop:h-2/5 min-h-24 max-h-32"
						onChange={data ? handleInputss : handleTextArea}
						value={data && datas ? datas.description : task.description}
					></textarea>

					<div className="flex gap-3 py-4 tablet:flex-row flex-col">
						<ComboboxPopover priorities={data ? data.priority : priority} />

						<DatePickerDemo unixTimeSeconds={data && datas ? datas.dueDate : 0} />
					</div>

					<div className="flex font-medium text-white justify-center py-4 w-full">
						<button className="px-4 py-2 rounded-md bg-indigo-500 mx-2" onClick={toggleOffAddTask}>
							Close
						</button>
						<button className="px-4 py-2 rounded-md bg-green-500 mx-2" onClick={data ? handleEditTask : handleSetSubmitTask}>
							Save
						</button>
					</div>
				</div>
			</div>
		</AddTaskContext.Provider>
	);
};

export default AddTask;
