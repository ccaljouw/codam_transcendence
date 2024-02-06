export default function CodeCoverage() {
	const externalWebsiteUrl = 'http://localhost:3001/test/backend/report';
	return (
		<>
			<div className="transcendenceCodeCoverage">
				<iframe src={externalWebsiteUrl} title="Code coverage" style={{ width: '100%', height:'100%' }}/>
			</div>
		</>
	);
}