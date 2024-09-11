import ChatArea from "src/globals/layoutComponents/Chat/ChatArea";
import { MenuBar } from "src/globals/layoutComponents/MenuBar";

export default function Layout({children} : {children: React.ReactNode}) : JSX.Element {
	return (
		<>
			<MenuBar/>
			<div className="content-area">
				<div className="page index-left">
					{children}
				</div>
				<div className="chat-area index-right">
					<ChatArea/>
				</div>
			</div>
		</>
	);
}
