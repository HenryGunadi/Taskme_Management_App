import {useContext} from 'react';
import {DashboardContext} from '../Dashboard';
import {DashboardContextType, DashboardTasksType} from '../Types';
import images from '../../assets/image';

const AddTaskButton: React.FC = () => {
	const {toggleAddTask} = useContext(DashboardContext) as DashboardContextType;

	return (
		<div
			className="flex items-center absolute right-6 bottom-2 transform transition hover:-translate-y-1 duration-300 hover:cursor-pointer hover:opacity-70"
			onClick={() => {
				toggleAddTask(null);
			}}
		>
			<h1 className="px-2 font-medium">Add Task</h1>

			<img src={images.plusIcon} alt="" className="w-8 h-auto" />
		</div>
	);
};

export default AddTaskButton;
