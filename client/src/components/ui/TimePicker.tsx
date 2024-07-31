import {useContext} from 'react';
import {MainDashboardContext} from '../MainDashboard';
import {MainDashboardType} from '../Types';

const TimePicker: React.FC = () => {
	const {dailyTasks, handleDailyTaskTime} = useContext(MainDashboardContext) as MainDashboardType;

	return (
		<div className="flex items-center gap-2">
			{/* hour */}
			<div className="flex flex-col w-12 items-center">
				<input
					type="number"
					min={0}
					max={24}
					className="text-center py-2 w-full outline-none border border-slate-600 rounded-md bg-slate-100"
					value={dailyTasks.time?.hour || 0}
					name="hour"
					onChange={handleDailyTaskTime}
				/>
			</div>

			<h1 className="text-3xl mb-2 font-semibold">:</h1>

			{/* minute */}
			<div className="flex flex-col w-12 items-center">
				<input
					type="number"
					min={0}
					max={59}
					className="text-center py-2 w-full outline-none border border-slate-600 rounded-md bg-slate-100"
					value={dailyTasks.time?.minute || 0}
					name="minute"
					onChange={handleDailyTaskTime}
				/>
			</div>
		</div>
	);
};

export default TimePicker;
