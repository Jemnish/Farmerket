// src/components/UserOrders/UserOrders.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserOrders from './UserOrders';
import { userDetailsApi } from '../../api/Api';
import { toast } from 'react-toastify';

// Mock the API function
jest.mock('../../api/Api', () => ({
  userDetailsApi: jest.fn(),
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('UserOrders Component', () => {
  beforeEach(() => {
    // Mock localStorage
    const userData = { _id: 'user1', orders: [] }; // Empty orders array
    global.localStorage.setItem('userData', JSON.stringify(userData));
  });

 
  test('should show no orders message when there are no orders', async () => {
    // Mock API response for no orders
    userDetailsApi.mockResolvedValue({
      data: {
        success: true,
        userData: {
          orders: [],
        },
      },
    });

    render(<UserOrders />);

    await waitFor(() => {
      expect(userDetailsApi).toHaveBeenCalledWith({ userId: 'user1' });
    });

    expect(screen.getByText('Your Orders')).toBeInTheDocument();
    expect(screen.getByText('No orders history found.')).toBeInTheDocument();
  });

 
});
