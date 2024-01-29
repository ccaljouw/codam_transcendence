import React from 'react';

const SwaggerPage: React.FC = () => {
  const externalWebsiteUrl = 'http://localhost:3001/api';

  return (
			<div className="transcendence-Swagger">
        <iframe src={externalWebsiteUrl} title="API" style={{ width: '100%', height:'100vh' }}/>
      </div>
  );
};

export default SwaggerPage
