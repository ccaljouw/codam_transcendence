import styles from './styles.module.css';

export default function Page() : JSX.Element {
	const externalWebsiteUrl = 'http://localhost:3001/api';
	return (
		<>
			<div className={styles.swagger}>
				<iframe src={externalWebsiteUrl} title="API"/>
			</div>
		</>
	);
}

//todo: JMA: use constants url