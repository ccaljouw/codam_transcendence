import GameComponent from "./components/Game.tsx";
import styles from './styles.module.css';

export default function Page() {
	return (
		<div className={`white-box ${styles.gameShell}`}>
			<GameComponent />
		</div>
	);
}
