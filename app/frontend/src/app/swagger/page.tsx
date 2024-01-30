export default function Page() {
	const externalWebsiteUrl = 'http://localhost:3001/api';
	return (
		<>
			<div className="transcendenceSwagger">
				<iframe src={externalWebsiteUrl} title="API" style={{ width: '100%', height:'100%' }}/>
			</div>
		</>
	);
}


