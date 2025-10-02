import '@testing-library/jest-native/extend-expect';
import React from 'react';

// Mock vector icons to avoid native dependency in tests
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props: any) => React.createElement(View, props);
  return { Ionicons: MockIcon };
}, { virtual: true });
