import Test from '../components/Test';
import { constants } from '@global/constants.globalvar';

export default function page() : JSX.Element {
  return (
    <>
      <h1>Backend tests</h1>
      <Test url={ constants.API_TEST_BACKEND } iframeTitle="Backend tests output" />
    </>
  );
}
