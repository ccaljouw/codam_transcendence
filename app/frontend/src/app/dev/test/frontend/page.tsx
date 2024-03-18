import { constants } from '@ft_global/constants.globalvar';
import Test from '../components/Test';

export default function page() : JSX.Element {
  return (
    <>
      <h1>Frontend tests</h1>
      <Test url= { constants.API_TEST_FRONTEND } iframeTitle="Frontend tests output" />
    </>
  );
}
