import IframeHolder from "@global/functionComponents/IframeHolder";

export default function TestCoverage() {
	const CoverageUrl = 'http://localhost:3001/test/report';
	return (
      <IframeHolder url={CoverageUrl} title="Coverage of last run tests" />
	)
}

//todo: JMA: add constants url's
