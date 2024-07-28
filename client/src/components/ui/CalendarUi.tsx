'use client';

import * as React from 'react';

import {Calendar} from './calendar';
import {MainDashboardContext} from '../MainDashboard';
import {MainDashboardType} from '../Types';

export function stripTime(date: Date): Date {
	return new Date(date.setHours(0, 0, 0, 0));
}

export type CalendarType = {
	dueDates: Date[];
};

export const CalendarContext = React.createContext<CalendarType | undefined>(undefined);

export function CalendarDemo() {
	const {dashboardTasks} = React.useContext(MainDashboardContext) as MainDashboardType;
	const notNullDashboardTasks = dashboardTasks ?? [];
	const dueDates = notNullDashboardTasks.filter((task) => task.status !== true).map((task) => stripTime(new Date(task.dueDate * 1000)));

	return (
		<CalendarContext.Provider value={{dueDates}}>
			<Calendar mode="multiple" selected={dueDates} className="rounded-md border w-full bg-white h-fit" />
		</CalendarContext.Provider>
	);
}
