import ChatArea from "src/globals/layoutComponents/Chat/ChatArea";
import { MenuBar } from "src/globals/layoutComponents/MenuBar";
import { Suspense } from 'react';

export default function Layout({children} : {children: React.ReactNode}) : JSX.Element {
	return (
		<>

			<MenuBar/>
			<div className="content-area">
				<div className="page index-left">
		{/* <Suspense> */}
					{children}
		{/* </Suspense> */}
				</div>
				<div className="chat-area index-right">
					<ChatArea/>
				</div>
			</div>
		</>
	);
}
