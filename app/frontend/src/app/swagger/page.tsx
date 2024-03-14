import styles from './styles.module.css';
import { constants } from '@global/vars';

export default function Page() : JSX.Element {
	return (
		<>
			<div className={styles.swagger}>
				<iframe src={constants.API_SWAGGER} title="API"/>
			</div>
		</>
	);
}
