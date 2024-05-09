import GameComponent from "./components/Game.tsx";
import Link from 'next/link';
import styles from './styles.module.css';

export default function Page() {
	return (
		<>
		<div className={styles.game}>
			<div className={"text-center white-box " + styles.gameMenu}>
				<Link className="btn btn-dark" href="/play">Leave Game</Link>
			</div>
			<GameComponent />
		</div>
		</>
	);
}
