import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/stylesheet.css';
// import '../styles/styleSimpleGrid.css'; // JMA: leave this for now for easy switching
import '../styles/styleStrongPong.css';
import { ContextProvider } from '@ft_global/contextprovider.globalvar';
import { comic_neue } from '@ft_global/layoutComponents/Font';
import BootstrapClient from '@ft_global/layoutComponents/BootstrapClient';
import ChatArea from 'src/globals/layoutComponents/ChatArea';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'STRONGPONG',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) : Promise<JSX.Element> {
	console.log("root rerender");
    return (
		<html lang="en" >
			<body>
				<div className={`root-layout ${comic_neue.className}`}>
					<ContextProvider>
						<div className="content-area">
							<div className="page index-left">
								{children}
							</div>
							<div className="chat-area index-right">
								<ChatArea />
							</div>
						</div>
					</ContextProvider>
				</div>
				<BootstrapClient />
			</body>
		</html>
    );
}
