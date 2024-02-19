import MenuBar from './components/MenuBar.tsx';
import ChatArea from './components/ChatArea.tsx';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/stylesheet.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
		<html lang="en">
			<body>
				<div className="root-layout">
					<MenuBar />
					<div className="content-area">
						<div className="page">
							{children}
						</div>
						<div className="chat">
							<ChatArea />
						</div>
					</div>
				</div>
			</body>
		</html>
    );
}
