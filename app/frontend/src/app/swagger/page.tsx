import styles from './styles.module.css';
import { constants } from 'src/globals/constants.globalvar';

export default function Page() : JSX.Element {
	return (
		<>
			<div className={styles.swagger}>
				<iframe src={constants.API} title="API"/>
			</div>
		</>
	);
}
