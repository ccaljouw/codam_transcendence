'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AllTests = dynamic(() => import('../../components/AllTests'));
const BackendTests = dynamic(() => import('../../components/BackendTests'));
const FrontendTests = dynamic(() => import('../../components/FrontendTests'));
const Seed = dynamic(() => import('../../components/Seed'));
const TestCoverage = dynamic(() => import('../../components/TestCoverage'));

const IndexPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('TestCoverage');
  const [loadedComponents, setLoadedComponents] = useState<string[]>([]);

  const handleComponentChange = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  useEffect(() => {
    // Load the component dynamically only if it hasn't been loaded before
    if (!loadedComponents.includes(selectedComponent)) {
      import(`../../components/${selectedComponent}`).then(() => {
        setLoadedComponents((prevLoaded) => [...prevLoaded, selectedComponent]);
      });
    }
  }, [selectedComponent, loadedComponents]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'AllTests':
        return <AllTests />;
      case 'BackendTests':
        return <BackendTests />;
      case 'FrontendTests':
        return <FrontendTests />;
      case 'Seed':
        return <Seed />;
      case 'TestCoverage':
        return <TestCoverage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: selectedComponent === 'AllTests' ? 'underline' : 'none',
            }}
            onClick={() => handleComponentChange('AllTests')}
          >
            Run All Tests
          </div>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: selectedComponent === 'BackendTests' ? 'underline' : 'none',
            }}
            onClick={() => handleComponentChange('BackendTests')}
          >
            Run Backend Tests
          </div>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: selectedComponent === 'FrontendTests' ? 'underline' : 'none',
            }}
            onClick={() => handleComponentChange('FrontendTests')}
          >
            Run Frontend Tests
          </div>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: selectedComponent === 'TestCoverage' ? 'underline' : 'none',
            }}
            onClick={() => handleComponentChange('TestCoverage')}
          >
            Show test Coverage
          </div>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: selectedComponent === 'Seed' ? 'underline' : 'none',
            }}
            onClick={() => handleComponentChange('Seed')}
          >
            Seed
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>{renderComponent()}</div>
    </div>
  );
};

export default IndexPage;
