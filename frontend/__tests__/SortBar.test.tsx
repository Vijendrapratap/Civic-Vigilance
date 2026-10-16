import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SortBar from '../components/SortBar';

describe('SortBar', () => {
  it('changes selection when a chip is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = render(<SortBar value="trending" onChange={onChange} />);
    fireEvent.press(getByText('newest'));
    expect(onChange).toHaveBeenCalledWith('newest');
  });
});
