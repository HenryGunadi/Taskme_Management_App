import axios from 'axios';
import {RegisterUserPayload} from './Types';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

// path prefix to backend
const backendBaseUrl: string = 'http://localhost:8080/api/v1';

const Register: React.FC = () => {
	// react router dom
	const navigate = useNavigate();
	const navigateToLogin = () => {
		navigate(`/login`);
	};

	// set empty formData
	const [formData, setFormData] = useState<RegisterUserPayload>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	});

	// handle submitform function
	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const response = await axios.post(`${backendBaseUrl}/register`, formData);

			window.alert('Sign up successful');
			navigateToLogin();
			console.log('Registration successful: ', response.data);
		} catch (err) {
			console.error(`Registration failed: `, err);
			window.alert('User already exists or invalid email');
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			{/* register container */}
			<div className="w-1/3 h-3/4 border border-black flex flex-col justify-center items-center">
				<h1>Sign up</h1>
				<form action="" className="flex flex-col" onSubmit={handleFormSubmit}>
					<input
						type="text"
						className="mt-2 border border-black p-2"
						placeholder="First Name"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						className="mt-2 border border-black p-2"
						placeholder="Last Name"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
					/>
					<input
						type="email"
						className="mt-2 border border-black p-2"
						placeholder="Email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						className="mt-2 border border-black p-2"
						placeholder="Password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
					/>

					<button type="submit" className="m-2">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
