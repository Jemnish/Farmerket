import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import { toast } from "react-toastify";
import { registerUserApi } from "../../api/Api";

// Mock API
jest.mock("../../api/Api");

// Test case
describe("Register Component Test", () => {
  // Clearing mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display an error toast on failed register", async () => {
    // Render the Register component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Mocking the API response for failed registration
    const mockResponse = {
      data: {
        success: false,
        message: "User Already Exists!",
      },
    };

    // Configuring mock resolved value
    registerUserApi.mockResolvedValue(mockResponse);

    // Configuring that toast error message as a test function
    toast.error = jest.fn();

    // Find the input fields and submit button
    const fullname = screen.getByPlaceholderText("Full Name");
    const phone = screen.getByPlaceholderText("Phone");
    const username = screen.getByPlaceholderText("Username");
    const userType = screen.getByRole("combobox");
    const password = screen.getByPlaceholderText("Password");
    const confirmPassword = screen.getByPlaceholderText("Confirm Password");
    const registerBtn = screen.getByText("Register");

    // Simulate user input
    fireEvent.change(fullname, { target: { value: "John Doe" } });
    fireEvent.change(phone, { target: { value: "1234567890" } });
    fireEvent.change(username, { target: { value: "johndoe" } });
    fireEvent.change(userType, { target: { value: "Buyer" } });
    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirmPassword, { target: { value: "password123" } });
    fireEvent.click(registerBtn);

    // Assert API call and toast error
    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        fullname: "John Doe",
        phone: "1234567890",
        username: "johndoe",
        usertype: "Buyer",
        password: "password123",
      });
      expect(toast.error).toHaveBeenCalledWith("User Already Exists!");
    });
  });
});
