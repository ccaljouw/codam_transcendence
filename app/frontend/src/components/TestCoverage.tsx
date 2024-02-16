function TestCoverage() {
	const CoverageBackendUrl = 'http://localhost:3001/test/backend/report';
	const CoverageFrontendUrl = 'http://localhost:3001/test/frontend/report';
	return (
		<div style={{ width: '100%', height:'100%' }}>
			<div className="row">
				<div className="col">
					<div>
						<h1 style={{color: 'black', padding: '10px'}} >Backend Coverage</h1>
						<iframe src={CoverageBackendUrl} title="Code coverage" style={{ width: '100%', height:'75vh' }}/>
					</div>
				</div>
				<div className="col">
					<div>
						<h1 style={{color: 'black', padding: '10px'}} >Frontend Coverage</h1>
						<iframe src={CoverageFrontendUrl} title="Code coverage" style={{ width: '100%', height:'75vh' }}/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TestCoverage;