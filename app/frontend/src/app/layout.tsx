"use client"; // will probably not be used in rootLayout
import MenuBar from './components/MenuBar.tsx';
import Chat from './components/Chat.tsx';
import { Metadata } from 'next'; // metadata, will probably be used
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/stylesheet.css';
// import '../styles/styleCloudySky.css'; // turn this on for a cloudy sky theme
// import '../styles/styleNeonDark.css'; // turn this on for a neon dark theme

import {useState, useEffect} from 'react'; // will probably not be ised in rootLayout

// // Below is metadata, will probably be used
// export const metadata: Metadata = {
// 	title: 'Pong',
// 	description: 'Challenge and meet new friends through a game of Pong',
// }

export default function RootLayout({children}: {children: React.ReactNode}) {
	const [navbarHeight, setNavbarHeight] = useState<number>(50);

	useEffect(() => {
		const navbarElement = document.querySelector('.navbar') as HTMLElement | null;
		if (navbarElement) {
			setNavbarHeight(navbarElement.offsetHeight);
		}

		const handleResize = () => {
			if (navbarElement) {
				setNavbarHeight(navbarElement.offsetHeight);
				console.log(navbarElement.offsetHeight);
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const containerStyle: React.CSSProperties = {
		height: `calc(100% - ${navbarHeight}px)`,
		marginTop: `${navbarHeight}px`,
	};

	return (
	<html lang="en">
		<body>
			<MenuBar/>
		<div className="container-fluid" style={containerStyle}>
			<div className="row h-100">
				<div className="col col-md-9 col-12 page">
					{children}
				</div>
				<div className="col col-md-3 col-12 chat">
					<Chat/>
				</div>
			</div>
		</div>
		</body>
	</html>
	);
}

//todo: find a nicer way to get the height of the page perfect every time