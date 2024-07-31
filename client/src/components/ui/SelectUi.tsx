import * as React from 'react';

import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './select';
import {MainDashboardContext} from '../MainDashboard';
import {MainDashboardType} from '../Types';

const SelectUi: React.FC = () => {
	const {handleDailyTaskCategory} = React.useContext(MainDashboardContext) as MainDashboardType;

	return (
		<Select onValueChange={handleDailyTaskCategory}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a category" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Categories</SelectLabel>
					<SelectItem value="health">
						<i className="fa-solid fa-dumbbell text-slate-500 mr-2"></i>
						Health
					</SelectItem>
					<SelectItem value="study">
						<i className="fa-solid fa-book text-slate-500 mr-2"></i>
						Study
					</SelectItem>
					<SelectItem value="work">
						<i className="fa-solid fa-briefcase text-slate-500 mr-2"></i>
						Work
					</SelectItem>
					<SelectItem value="finance">
						<i className="fa-solid fa-money-bill text-slate-500 mr-2"></i>
						Finance
					</SelectItem>
					<SelectItem value="food">
						<i className="fa-solid fa-utensils text-slate-500 mr-2"></i>
						Food
					</SelectItem>
					<SelectItem value="familyTime">
						<i className="fa-solid fa-people-roof text-slate-500 mr-2"></i>
						Family-Time
					</SelectItem>
					<SelectItem value="else">Else...</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SelectUi;
