import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from '../../src/components/data-table';

describe('DataTable Component', () => {
  const mockData = [
    { name: 'John', age: 25, city: 'New York' },
    { name: 'Jane', age: 30, city: 'London' },
    { name: 'Bob', age: 35, city: 'Tokyo' }
  ];

  it('should render data table with all rows', () => {
    render(<DataTable data={mockData} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<DataTable data={mockData} />);
    
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.getByText('city')).toBeInTheDocument();
  });

  it('should limit rows when maxRows is specified', () => {
    render(<DataTable data={mockData} maxRows={2} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('should render with custom columns', () => {
    render(<DataTable data={mockData} columns={['name', 'age']} />);
    
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.queryByText('city')).not.toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(<DataTable data={[]} />);
    
    // Should render table structure even with no data
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<DataTable data={mockData} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
