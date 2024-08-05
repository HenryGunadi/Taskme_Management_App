import {DashboardContextType, TaskContainerProps, TaskType} from '../Types';
import DeleteTask from '../ui/DeleteTask';
import images from '../../assets/image';
import {useContext} from 'react';
import {DashboardContext} from '../Dashboard';
import FinishTask from '../ui/FinishTask';
import {TaskContext} from '../Task';

const TaskContainer: React.FC<TaskContainerProps> = ({data}) => {
	const date = new Date(data.dueDate && data.dueDate * 1000);
	const {toggleEdited} = useContext(DashboardContext) as DashboardContextType;
	const {toggleComplete, isCompleted} = useContext(TaskContext) as TaskType;

	return (
		<div className="w-full rounded-lg shadow-sm flex flex-col p-4 bg-white my-4 h-fit">
			<div className="w-full flex items-center justify-between pb-2">
				<div
					className={`${
						(data.priority === 'high' && 'bg-red-100 text-red-500') ||
						(data.priority === 'medium' && 'bg-yellow-100 text-yellow-500') ||
						(data.priority === 'low' && 'bg-green-100 text-green-500')
					} px-2 py-1 rounded-lg text-sm font-medium`}
				>
					{data.priority && data.priority.charAt(0).toUpperCase() + data.priority.slice(1).toLowerCase()}
				</div>

				<div className="flex gap-2">
					<DeleteTask taskID={data.taskID} />
					<i
						className="text-slate-500 fa-regular fa-pen-to-square text-lg hover:cursor-pointer transition duration-300 hover:opacity-50"
						onClick={() => {
							toggleEdited(data);
						}}
					></i>
				</div>
			</div>

			<h1 className="font-medium pb-2 text-base tracking-wide">
				{data.title && data.title.charAt(0).toUpperCase() + data.title.slice(1).toLowerCase()}
			</h1>

			<label htmlFor="desc" className="text-sm font-medium">
				Description
			</label>

			<div className="w-full">
				<pre id="desc" className="pt-1 mb-4 text-sm text-slate-500 whitespace-pre-wrap break-words">
					{data.description}
				</pre>
			</div>

			<div className="flex items-center py-2 justify-between">
				<div className="flex gap-2">
					<img src={images.calendar} alt="" className="w-5 h-auto min-w-5 object-cover" />
					<h1 className="text-sm">{date.toDateString()}</h1>
				</div>

				<FinishTask taskID={data.taskID} dashboard={false} toggleComplete={toggleComplete} status={data.status} />
			</div>
		</div>
	);
};

export default TaskContainer;
