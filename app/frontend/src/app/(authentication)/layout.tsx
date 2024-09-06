import { FontBangers } from "src/globals/layoutComponents/Font";
import { MenuBarLogin } from "src/globals/layoutComponents/MenuBar";

export default function Layout({children} : {children: React.ReactNode}) : JSX.Element {
	return (
		<>
			<MenuBarLogin/>
			<div className="content-area row">
				<div className="col col-3 mt-0 index-left">
					<FontBangers>
						<h1>STRONGPONG</h1>
						<p>Play pong and build stronger relationships</p>
					</FontBangers>
				</div>
				<div className="col col-9 mt-0 index-right">
					<div className="row">
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
