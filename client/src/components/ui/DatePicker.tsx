'use client';

import * as React from 'react';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';

import {cn} from '../../lib/utils';
import {Button} from './button';
import {Calendar} from './calendar';
import {Popover, PopoverContent, PopoverTrigger} from './popover';
import {DashboardContext} from '../Dashboard';
import {AddTaskContextType, DashboardContextType} from '../Types';
import {AddTaskContext} from './AddTask';

type DatePickerProps = {
	unixTimeSeconds: number;
};

const DatePickerDemo: React.FC<DatePickerProps> = ({unixTimeSeconds}) => {
	function isEditOrAddTask(unixTimeSeconds: number): Date | undefined {
		if (unixTimeSeconds !== 0) {
			return new Date(unixTimeSeconds * 1000);
		}

		return undefined;
	}

	const dueDate = isEditOrAddTask(unixTimeSeconds);

	const {handleCalendar} = React.useContext(DashboardContext) as DashboardContextType;
	const {handleCalendarUpdate} = React.useContext(AddTaskContext) as AddTaskContextType;
	const [date, setDate] = React.useState<Date>(dueDate || new Date());

	// users dueDate

	React.useEffect(() => {
		console.log('component date : ', date);
		if (date) {
			const currentUnixTime = Math.floor(date.getTime() / 1000);
			console.log('unix time : ', currentUnixTime);
			handleCalendar(currentUnixTime);
		}
	}, [date]);

	const handleSelectDate = (day: Date | undefined) => {
		if (day) {
			const unixTimeSeconds = Math.floor(day.getTime() / 1000);
			handleCalendarUpdate(unixTimeSeconds);
			setDate(day);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={date} onSelect={handleSelectDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
};

export default DatePickerDemo;
