import {useNavigate} from 'react-router-dom';

export const navigate = (location: string) => {
	const navigates = useNavigate();
	navigates(location);
};
