import Test from '../components/Test';
import { constants } from '@ft_global/constants.globalvar';
import { FontBangers } from 'src/globals/layoutComponents/Font';

export default function page() : JSX.Element {
  return (
    <>
      <FontBangers>
        <h3>Backend tests</h3>
      </FontBangers>
      <Test url={ constants.API_TEST_BACKEND } iframeTitle="Backend tests output" />
    </>
  );
}
