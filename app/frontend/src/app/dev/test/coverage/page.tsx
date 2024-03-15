import IframeHolder from "@global/functionComponents/IframeHolder";

export default function TestCoverage() {
	const CoverageBackendUrl = 'http://localhost:3001/test/backend/report';
	const CoverageFrontendUrl = 'http://localhost:3001/test/frontend/report';
	return (
		<div className="row">
			<div className="col">
				<div>
					<h1>Backend Coverage</h1>
					<IframeHolder url={CoverageBackendUrl} title="Backend code coverage" />

				</div>
			</div>
			<div className="col">
				<div>
					<h1>Frontend Coverage</h1>
					<IframeHolder url={CoverageFrontendUrl} title="Frontend code coverage" />
				</div>
			</div>
		</div>
	)
}

//todo: JMA: add constants url's
