import {LinearProgress} from '@mui/material';

const Loading: React.FC = () => {
	return (
		<div className="fixed top-0 w-full z-10">
			<LinearProgress />
		</div>
	);
};

export default Loading;
