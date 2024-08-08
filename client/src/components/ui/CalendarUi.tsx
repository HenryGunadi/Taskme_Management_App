'use client';

import * as React from 'react';

import {Calendars} from './calendars';
import {DashboardContextType, DashboardTasksType} from '../Types';
import axios from 'axios';
import {backendUrl} from '../Login';
import {createContext} from 'react';
import {ScrollArea} from './scroll-area';
import {ScrollAreaViewport} from '@radix-ui/react-scroll-area';
import images from '../../assets/image';
import {DashboardContext} from '../Dashboard';
import {limitTitleToLetters} from '../services/TrimLetters';

export type CalendarContextType = {
	notFinishedTasks: Date[] | undefined;
	handleIsClicked: (date: Date) => void;
};

const getDateWithoutTime = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth(); // Months are zero-based in JavaScript
	const day = date.getDate();

	// Create a new date object with only year, month, and day
	return new Date(year, month, day);
};

const getUnixTimeSecondsWithoutTime: (unixSeconds: number) => number = (unixSeconds: number) => {
	const date = new Date(unixSeconds * 1000);
	const newUnixSeconds = Math.floor(getDateWithoutTime(date).getTime() / 1000);
	return newUnixSeconds;
};

export const CalendarUiContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarDemo() {
	const [isClicked, setIsClicked] = React.useState<boolean>(false);
	const [daySelected, setDaySelected] = React.useState<number | undefined>(undefined);
	const {submitTask, anyTaskChanges, edited} = React.useContext(DashboardContext) as DashboardContextType;

	const handleIsClicked = (date: Date) => {
		const dateWithoutTime = getDateWithoutTime(date);
		setIsClicked((prev) => !prev);
		const unixTimeSeconds = Math.floor(dateWithoutTime.getTime() / 1000);
		setDaySelected(unixTimeSeconds);
	};
	const dayStr = daySelected && new Date(daySelected * 1000).toDateString();

	const token = localStorage.getItem('token');
	const [calendarTasks, setCalendarTasks] = React.useState<DashboardTasksType[] | undefined>(undefined);

	const notFinishedTasks: Date[] | undefined = calendarTasks
		?.filter((task) => task.status !== true)
		.map((task: DashboardTasksType) => {
			return new Date(task.dueDate * 1000);
		});

	React.useEffect(() => {
		if (token) {
			const fetchCalendarTasks = async () => {
				const response = await axios.get<DashboardTasksType[]>(`${backendUrl}/dashboardTasks`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 200 && response.data) {
					setCalendarTasks(response.data);
				}
			};

			fetchCalendarTasks();
		}
	}, [submitTask, token, anyTaskChanges, edited]);

	return (
		<CalendarUiContext.Provider value={{notFinishedTasks, handleIsClicked}}>
			<Calendars mode="multiple" selected={notFinishedTasks} className="rounded-md w-full shadow-md border flex justify-center" />
			{isClicked && (
				<div className="fixed inset-0 flex justify-center items-center z-50">
					<ScrollArea className="laptop:w-1/4 w-full mx-4 h-1/2 overflow-auto bg-white p-4 rounded-lg">
						<div className="w-full flex justify-between pb-2">
							<h1 className="text-base">{dayStr}</h1>

							<img
								src={images.xIcon}
								alt=""
								className="hover:cursor-pointer"
								onClick={() => {
									setIsClicked(false);
								}}
							/>
						</div>
						<ScrollAreaViewport>
							{calendarTasks &&
								calendarTasks
									.filter((task: DashboardTasksType) => getUnixTimeSecondsWithoutTime(task.dueDate) === daySelected)
									.map((task: DashboardTasksType, index: number) => {
										const trimmedTitle: string = limitTitleToLetters(task.title, 10);
										return (
											<div key={index} className="flex w-full pb-2 justify-between items-center">
												<div className="flex items-center gap-2">
													<div
														className={`rounded-sm w-3 h-3  ${
															(task.priority === 'high' && 'bg-red-500') ||
															(task.priority === 'medium' && 'bg-yellow-500') ||
															(task.priority === 'low' && 'bg-green-500')
														}`}
													></div>
													<h1 className="">{trimmedTitle}</h1>
												</div>

												<h1 className="text-slate-500 text-sm">Ongoing</h1>
											</div>
										);
									})}
						</ScrollAreaViewport>
					</ScrollArea>
				</div>
			)}

			<div className={`fixed inset-0 ${isClicked ? 'bg-black opacity-50' : 'hidden'} w-full h-full z-30`}></div>
		</CalendarUiContext.Provider>
	);
}
