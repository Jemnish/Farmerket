// src/setupTests.js
import { configure } from '@testing-library/react';

// Mock CSS imports
const mockStyleModule = {};

configure({
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
});
