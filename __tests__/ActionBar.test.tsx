import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionBar from '../components/ActionBar';

describe('ActionBar', () => {
  it('fires upvote and downvote handlers', () => {
    const onUpvote = jest.fn();
    const onDownvote = jest.fn();
    const { getByLabelText } = render(
      <ActionBar vote={0} upvotes={1} downvotes={0} comments={0} onUpvote={onUpvote} onDownvote={onDownvote} />
    );
    fireEvent.press(getByLabelText('Upvote'));
    fireEvent.press(getByLabelText('Downvote'));
    expect(onUpvote).toHaveBeenCalled();
    expect(onDownvote).toHaveBeenCalled();
  });
});
