"use server"

import MenuBar from './components/MenuBar.tsx';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/stylesheet.css';
import '../styles/styleSimpleGrid.css';
import { ContextProvider } from '../globals/contextprovider.globalvar.tsx';
// import ClientComponentWrapper from './componentwrapper.tsx';

export default async function  RootLayout({ children }: { children: React.ReactNode }) {
	console.log("root rerender");
    return (
		<html lang="en">
			<body>
			<div className="root-layout">
				<MenuBar />
			<ContextProvider>{children}</ContextProvider>
			</div>
			</body>
		</html>
    );
}
