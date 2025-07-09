import { render, screen } from '@testing-library/react';
import App from './App';

test('renders e-commerce app', () => {
  render(<App />);
  const linkElement = screen.getByText(/E-Commerce App/i);
  expect(linkElement).toBeInTheDocument();
});
