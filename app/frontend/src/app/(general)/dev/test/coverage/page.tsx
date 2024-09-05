import IframeHolder from "@ft_global/functionComponents/IframeHolder";
import { constants } from "@ft_global/constants.globalvar";

export default function TestCoverage() {
	return (
      <IframeHolder url={constants.API_TEST_REPORT} title="Coverage of last run tests" />
	)
}
