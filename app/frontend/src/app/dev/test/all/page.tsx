import Test from '../components/Test';

export default function page() : JSX.Element {
  return (
    <>
      <h1>All tests</h1>
      <Test url="http://localhost:3001/test/all" iframeTitle="All tests output" />
    </>
  );
}
