import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/stylesheet.css';
// import '../styles/styleSimpleGrid.css'; // JMA: leave this for now for easy switching
import '../styles/styleStrongPong.css';
import { ContextProvider } from '@ft_global/contextprovider.globalvar';
import { comic_neue } from '@ft_global/layoutComponents/Font';
import BootstrapClient from '@ft_global/layoutComponents/BootstrapClient';
import ChatArea from 'src/globals/layoutComponents/ChatArea';
import useAuthentication from 'src/globals/functionComponents/useAuthentication';

export default async function RootLayout({ children }: { children: React.ReactNode }){
	// const {loginUser} = useAuthentication();
	// const {currentUser} = useContext(TranscendenceContext);

	console.log("root rerender");
    return (
		<html lang="en" >
			<body>
				<div className={`root-layout ${comic_neue.className}`}>
					<ContextProvider>
						<div className="content-area">
							<div className="page">
								{children}
							</div>
							<div className="chat-area">
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
