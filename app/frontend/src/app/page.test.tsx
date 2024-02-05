import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from "./page";

describe('Page Component', () => {
  it('renders home page with welcome text', () => {
    render(<Page />);
    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.getByText('Here you can see the welcome text, leaderboard and users. Chat on the bottom')).toBeInTheDocument();
  });
});
