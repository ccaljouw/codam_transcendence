import Test from '../components/Test';

export default function page() : JSX.Element {
  return (
    <>
      <h1>Frontend tests</h1>
      <Test url="http://localhost:3001/test/frontend" iframeTitle="Frontend tests output" />
    </>
  );
}
