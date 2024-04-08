import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/stylesheet.css';
// import '../styles/styleSimpleGrid.css'; // JMA: leave this for now for easy switching
import '../styles/styleStrongPong.css';
import { comic_neue } from 'src/globals/layoutComponents/Font';
import { ContextProvider } from '@ft_global/contextprovider.globalvar';
import BootstrapClient from '@ft_global/layoutComponents/BootstrapClient.tsx';

export default async function RootLayout({ children }: { children: React.ReactNode }){
	console.log("root rerender");
    return (
		<html lang="en" >
			<body>
				<div className={`root-layout ${comic_neue.className}`}>
					<ContextProvider>{children}</ContextProvider>
				</div>
				<BootstrapClient />
			</body>
		</html>
    );
}
