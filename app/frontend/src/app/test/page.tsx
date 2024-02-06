'use client'
import React, { useState, lazy, Suspense } from 'react';
import styles from '../../styles/menu.module.css';

const BackendComponent = lazy(() => import('../../components/BackendTests'));
const FrontendComponent = lazy(() => import('../../components/FrontendTests'));
const SeedComponent = lazy(() => import('../../components/Seed'));

const TestPage = () => {
  const [BackendComponentVisible, setComponent1Visible] = useState<boolean>(false);
  const [FrontendComponentVisible, setComponent2Visible] = useState<boolean>(false);
  const [SeedComponentVisible, setComponent3Visible] = useState<boolean>(false);
  
  const toggleComponentVisibility = (setterFunction: React.Dispatch<React.SetStateAction<boolean>>) => {
    setterFunction((prevVisibility) => !prevVisibility);
  };

  return (
    <div className="transcendenceProfile">
      <button className={styles.menuItemActive} onClick={() => toggleComponentVisibility(setComponent1Visible)}>
        {BackendComponentVisible ? 'Hide' : 'Run'} backend tests
      </button>
      <button className={styles.menuItemActive} onClick={() => toggleComponentVisibility(setComponent2Visible)}>
        {FrontendComponentVisible ? 'Hide' : 'Run'} frontend tests
      </button>
      <button className={styles.menuItemActive} onClick={() => toggleComponentVisibility(setComponent3Visible)}>
        {SeedComponentVisible ? 'Hide' : 'Run'} Seed
      </button>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="row">
          {BackendComponentVisible && <BackendComponent />}
          {FrontendComponentVisible && <FrontendComponent />}
          {SeedComponentVisible && <SeedComponent />}
        </div>
      </Suspense>
    </div>
  );
};

export default TestPage;
