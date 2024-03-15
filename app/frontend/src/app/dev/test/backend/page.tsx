import Test from '../components/Test';

export default function page() : JSX.Element {
  return (
    <>
      <h1>Backend tests</h1>
      <Test url="http://localhost:3001/test/backend" iframeTitle="Backend tests output" />
    </>
  );
}
