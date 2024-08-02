import GameComponent from "./components/Game.tsx";
import styles from './styles.module.css';

export default function Page({params} : {params: {inviteId: number}}) : JSX.Element {
	return (
		<div className={`white-box ${styles.gameShell}`}>
			<GameComponent inviteId={Number(params.inviteId)}/>
		</div>
	);
}
