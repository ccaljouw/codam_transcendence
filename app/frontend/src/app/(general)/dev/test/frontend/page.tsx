import { constants } from '@ft_global/constants.globalvar';
import Test from '../components/Test';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function page() : JSX.Element {
  return (
    <>
      <FontBangers>
        <h3>Frontend tests</h3>
      </FontBangers>
      <Test url= { constants.API_TEST_FRONTEND } iframeTitle="Frontend tests output" />
    </>
  );
}
