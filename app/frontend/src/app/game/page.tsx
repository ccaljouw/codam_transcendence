import GameComponent from "./components/Game.tsx";
import Link from 'next/link';
import styles from './styles.module.css';

export default function Page() {
	return (
		<>
		<div className={styles.game}>
			<div className={"text-center " + styles.gameMenu}>
				<Link className="btn btn-primary" href="/play" >Leave Game</Link>
				<Link className="btn btn-primary" href="#" >placeholder</Link>
			</div>
			<GameComponent />
		</div>
		</>
	);
}
