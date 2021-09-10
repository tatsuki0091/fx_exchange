import React from 'react';
import { screen, render } from '@testing-library/react';
import Home from '../pages/index';
import { getStaticProps } from '../pages/index';
import { FX_INFO } from '../pages/types';
const fxInfo = { quotes: [] };

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home fxInfo={fxInfo} />);

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBe('welcome to next.js!');
  });
});

{
}
