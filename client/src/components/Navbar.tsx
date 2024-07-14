import images from '../assets/image';
import Command from './Command';
import React, {useContext, useEffect} from 'react';
import {commandContext, ContextProps, imgUrlContext, ImgUrlInterface} from './Dashboard';

const Navbar: React.FC = () => {
	const {isCommand, toggleCommand} = useContext(commandContext) as ContextProps;
	const {imgFileUrl} = useContext(imgUrlContext) as ImgUrlInterface;

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isCommand) {
				toggleCommand();
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, [toggleCommand]);

	return (
		<>
			{/* navbar */}
			<div className="flex items-center justify-between py-4 pr-6 pl-4 border-b border-black w-full">
				<div className="w-80 min-w-64 border border-slate-500 bg-white px-2 py-1 rounded-md hover:cursor-pointer" onClick={toggleCommand}>
					<p className="text-slate-400">Search here...</p>
				</div>

				<div className="flex">
					<img src={images.notification} alt="" className="mx-2" />

					<div className="flex items-center">
						<img
							src={!imgFileUrl ? '' : imgFileUrl}
							alt=""
							className="min-w-12 min-h-12 w-12 h-12 rounded-full bg-black mx-2 object-cover object-center border border-black image-rendering-auto"
						/>
					</div>
				</div>
			</div>
			{/* command */}
			{isCommand ? <Command /> : ''}
		</>
	);
};

export default Navbar;
