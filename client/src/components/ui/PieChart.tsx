'use client';

import {Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart} from 'recharts';

import {ChartConfig, ChartContainer} from './Chart';
import React, {useContext} from 'react';
import {MainDashboardContext} from '../MainDashboard';
import {MainDashboardType} from '../Types';

const chartConfig = {
	visitors: {
		label: 'Visitors',
	},
	safari: {
		label: 'Safari',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

type PieChartProps = {
	totalOrToDosOrDailyTask: boolean | null;
};

const PieChartUi: React.FC<PieChartProps> = ({totalOrToDosOrDailyTask}) => {
	const {totalTasks, toDosData, dailyTaskData} = useContext(MainDashboardContext) as MainDashboardType;
	const chartData = [
		{
			browser: 'safari',
			visitors:
				(totalOrToDosOrDailyTask === true ? totalTasks.totalTasks : 0) ||
				(totalOrToDosOrDailyTask === false ? toDosData.totalTodos : 0) ||
				(totalOrToDosOrDailyTask === null ? dailyTaskData.totalDailyTasks : 0),
			fill: '#6366F1',
		},
	];

	const finishedTasks: number =
		(totalTasks.totalTasks > 0 &&
			(totalOrToDosOrDailyTask === true
				? Math.floor((totalTasks.finishedTotalTasks / totalTasks.totalTasks) * 360)
				: totalOrToDosOrDailyTask === null
				? Math.floor((dailyTaskData.finishedDailyTask / dailyTaskData.totalDailyTasks) * 360)
				: totalOrToDosOrDailyTask === false
				? Math.floor((toDosData.finishedTodos / toDosData.totalTodos) * 360)
				: 0)) ||
		0;

	return (
		<ChartContainer config={chartConfig} className="w-full mx-auto aspect-square max-h-[150px]">
			<RadialBarChart data={chartData} endAngle={finishedTasks} innerRadius={50} outerRadius={80}>
				<PolarGrid
					gridType="circle"
					radialLines={false}
					stroke="none"
					className="first:fill-muted last:fill-background"
					polarRadius={[55, 45]}
				/>
				<RadialBar dataKey="visitors" background />
				<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
					<Label
						content={({viewBox}) => {
							if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
								return (
									<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
										<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
											{chartData[0].visitors.toLocaleString()}
										</tspan>
										<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground">
											Tasks
										</tspan>
									</text>
								);
							}
						}}
					/>
				</PolarRadiusAxis>
			</RadialBarChart>
		</ChartContainer>
	);
};

export default PieChartUi;
