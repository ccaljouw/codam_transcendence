import MenuBar from './components/MenuBar.tsx';
import Chat from './components/Chat.tsx';
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
							<Chat />
						</div>
					</div>
				</div>
			</body>
		</html>
    );
}
