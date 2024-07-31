import {ChangeEvent} from 'react';

export interface RegisterUserPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	bio: string;
}

export interface LoginUserPayload {
	email: string;
	password: string;
}

// FOR COMMAND
export interface Item {
	id: number;
	route: string;
	name: string;
	type: string;
}

export interface filePayload {
	uploadName: string;
	url: string;
}

// for change settings
export interface changeSettingsPayload {
	firstName: string;
	lastName: string;
	email: string;
	bio: string;
}

export interface AlertInterface {
	isLoading: boolean;
	isSuccess: boolean | null;
	alertMsg: string;
}

export interface DashboardContextType {
	isCommand: boolean;
	toggleCommand: () => void;
	toggleOffCommand: () => void;
	toggleAddTask: (priority: string | null) => void;
	toggleAlert: (success: boolean | null, msg: string, loading: boolean) => void;
	imgFileUrl: string;
	handleInputs: (e: ChangeEvent<HTMLInputElement>) => void;
	handlePopOver: (value: string) => void;
	handleCalendar: (value: number) => void;
	handleTextArea: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	submitTask: boolean;
	toggleOffAddTask: () => void;
	priority: string | null;
	task: TaskDataInterface;
	handleSetSubmitTask: () => void;
	toggleEdited: (data: TaskDataFetch) => void;
	handleSetTaskDetails: (data: TaskDataFetch[]) => void;
	taskDetails: TaskDataFetch[] | null;
	toggleCheckEdited: (state: boolean) => void;
	edited: boolean;
	toggleEditUi: () => void;
	handleAnyTaskChanges: (state: boolean) => void;
	anyTaskChanges: boolean;
} //

export interface UserRoutes {
	route: string;
}

export interface ValidateMsgInterface {
	error: boolean;
	errorMsg: string;
}

export interface UserSettingsCtx {
	dataSettings: User;
	handleInputSettings: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handlePostSettings: () => Promise<void>;
	isChanged: boolean;
}

export interface TaskDataInterface {
	title: string;
	description: string;
	priority: string | null;
	dueDate: number;
	status: boolean | null;
}

export interface TaskDataFetch {
	taskID: string;
	title: string;
	description: string;
	priority: string | null;
	dueDate: number;
	status: boolean | null;
}

export interface TaskContainerProps {
	data: TaskDataFetch;
}

export type FinishTaskProps = {
	taskID: string;
};

export type TaskType = {
	toggleDelete: () => void;
	toggleComplete: () => void;
	isCompleted: boolean;
};

export type FinishTaskType = {
	taskID: string;
	dashboard: boolean;
	toggleComplete: () => void;
	status: boolean | null;
};

export type AddTaskContextType = {
	handleCalendarUpdate: (value: number) => void;
	handlePriority: (value: string) => void;
};

export interface DashboardTasksType {
	taskID: string;
	title: string;
	dueDate: number;
	status: boolean | null;
	priority: string | null;
}

export interface MainDashboardType {
	toggleCompleteDashboard: () => void;
	dashboardTasks: DashboardTasksType[] | null;
	handleSetDailyTask: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleDailyTaskCategory: (value: string) => void;
	dailyTasks: DailyTasksType;
	handleDailyTaskTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleIsAddedOrDeletedOrCompleted: (action: DailyTaskProps) => void;
	dailyTaskFetch: DailyTasksFetchType[];
}

type Time = {
	hour: number;
	minute: number;
};

export interface DailyTasksType {
	task: string;
	status: boolean;
	time: Time | null;
	category: string | null;
}

export interface DailyTasksFetchType {
	taskID: string;
	userID: string;
	task: string;
	status: boolean;
	time: Time;
	category: string | null;
}

export interface FinishDailyTaskType {
	taskID: string;
	task: DailyTasksFetchType;
}

export type DailyTaskProps = {
	added: boolean;
	deleted: boolean;
	completed: boolean;
};
