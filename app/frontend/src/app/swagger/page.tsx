import styles from './styles.module.css';

export default function Page() {
	const externalWebsiteUrl = 'http://localhost:3001/api';
	return (
		<>
			<div className={styles.swagger}>
				<iframe src={externalWebsiteUrl} title="API"/>
			</div>
		</>
	);
}
