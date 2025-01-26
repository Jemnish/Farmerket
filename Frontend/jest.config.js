module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
      '\\.(jpg|jpeg|png|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
    },
    testEnvironment: 'jsdom', // Ensures DOM-like environment
  };
  