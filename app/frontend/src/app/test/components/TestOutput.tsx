import React from 'react';

function TestOutput() {
  const externalWebsiteUrl = 'http://localhost:3001/test/output';

  return (
    <div>
      <div className="transcendenceSwagger" style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <iframe
          src={externalWebsiteUrl}
          title="Test output"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
}

export default TestOutput;