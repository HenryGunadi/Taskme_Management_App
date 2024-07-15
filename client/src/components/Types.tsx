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

export interface AlertContext {
	toggleAlert: (success: boolean | null, msg: string, loading: boolean) => void;
}

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
