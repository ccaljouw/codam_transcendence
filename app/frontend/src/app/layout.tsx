"use server";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/stylesheet.css';
import '../styles/styleSimpleGrid.css';
import { ContextProvider } from '@global/contextprovider.globalvar.tsx';
import MenuBar from '@global/layoutComponents/MenuBar';

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
