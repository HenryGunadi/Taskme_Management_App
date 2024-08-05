'use client';

import * as React from 'react';
import {Circle, LucideIcon} from 'lucide-react';

import {cn} from '../../lib/utils';
import {Button} from './button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from './command';
import {Popover, PopoverContent, PopoverTrigger} from './popover';
import {DashboardContext} from '../Dashboard';
import {AddTaskContextType, DashboardContextType} from '../Types';
import {AddTaskContext} from './AddTask';

type Status = {
	name: string;
	value: string;
	label: string;
	icon: LucideIcon;
};

const statuses: Status[] = [
	{
		name: 'priority',
		value: 'high',
		label: 'High',
		icon: Circle,
	},
	{
		name: 'priority',
		value: 'medium',
		label: 'Medium',
		icon: Circle,
	},
	{
		name: 'priority',
		value: 'low',
		label: 'Low',
		icon: Circle,
	},
];

type PopoverProps = {
	priorities: string | null;
};

const ComboboxPopover: React.FC<PopoverProps> = ({priorities}) => {
	const [open, setOpen] = React.useState(false);
	const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null);
	const {handlePopOver} = React.useContext(DashboardContext) as DashboardContextType;
	const {handlePriority} = React.useContext(AddTaskContext) as AddTaskContextType;

	React.useEffect(() => {
		setSelectedStatus(statuses.find((priority) => priority.value === priorities) || null);
	}, []);

	React.useEffect(() => {
		if (selectedStatus?.value) {
			handlePopOver(selectedStatus.value);
		} else {
			handlePopOver('low');
		}
	}, [selectedStatus?.value]);

	return (
		<div className="flex items-center space-x-4 relative">
			<p className="text-sm text-muted-foreground">Status</p>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="w-[150px] justify-start">
						{selectedStatus ? (
							<>
								<i
									className={`fa-solid fa-circle mr-2 ${
										(selectedStatus.value === 'high' && 'text-red-500') ||
										(selectedStatus.value === 'medium' && 'text-yellow-500') ||
										(selectedStatus.value === 'low' && 'text-green-500')
									}`}
								></i>
								{selectedStatus.label}
							</>
						) : (
							<>+ Set status</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0" side="bottom" align="center">
					<Command>
						<CommandInput placeholder="Change status..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{statuses.map((status) => (
									<CommandItem
										key={status.value}
										value={status.value}
										onSelect={(value) => {
											setSelectedStatus(statuses.find((priority) => priority.value === value) || null);
											setOpen(false);
											handlePriority(value);
										}}
									>
										<status.icon className={cn('mr-2 h-4 w-4', status.value === selectedStatus?.value ? 'opacity-100' : 'opacity-40')} />
										<span>{status.label}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default ComboboxPopover;
