import IframeHolder from "@global/functionComponents/IframeHolder";
import { constants } from "@global/constants.globalvar";

export default function TestCoverage() {
	return (
      <IframeHolder url={constants.API_TEST_REPORT} title="Coverage of last run tests" />
	)
}

//todo: JMA: add constants url's
