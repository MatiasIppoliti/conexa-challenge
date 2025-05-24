import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('🛸 Traveling through dimensions...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Fetching characters..." />);

    expect(screen.getByText('Fetching characters...')).toBeInTheDocument();
    expect(screen.getByText('🛸 Traveling through dimensions...')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);

    const spinner = container.querySelector('.w-8.h-8');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with medium size (default)', () => {
    const { container } = render(<LoadingSpinner size="md" />);

    const spinner = container.querySelector('.w-16.h-16');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);

    const spinner = container.querySelector('.w-24.h-24');
    expect(spinner).toBeInTheDocument();
  });

  it('renders without message when message is empty', () => {
    render(<LoadingSpinner message="" />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('🛸 Traveling through dimensions...')).toBeInTheDocument();
  });

  it('has correct animation classes', () => {
    const { container } = render(<LoadingSpinner />);

    const spinningElement = container.querySelector('.animate-spin');
    const pulsingElement = container.querySelector('.animate-pulse');
    const pingElement = container.querySelector('.animate-ping');

    expect(spinningElement).toBeInTheDocument();
    expect(pulsingElement).toBeInTheDocument();
    expect(pingElement).toBeInTheDocument();
  });

  it('renders with proper structure', () => {
    const { container } = render(<LoadingSpinner />);

    const mainContainer = container.querySelector('.flex.flex-col.items-center.justify-center.p-8');
    expect(mainContainer).toBeInTheDocument();
  });
}); 