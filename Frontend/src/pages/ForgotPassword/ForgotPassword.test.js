import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPassword from "./ForgotPassword";
import { forgotPasswordApi, verifyOtpApi } from "../../api/Api";

// Mock the API functions
jest.mock("../../api/Api");

describe("ForgotPassword Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send OTP and verify it successfully", async () => {
    const mockForgotPasswordResponse = {
      status: 200,
      data: { message: "OTP sent successfully!" },
    };
    const mockVerifyOtpResponse = {
      status: 200,
      data: { message: "Password updated successfully!" },
    };

    // Mock the API responses
    forgotPasswordApi.mockResolvedValue(mockForgotPasswordResponse);
    verifyOtpApi.mockResolvedValue(mockVerifyOtpResponse);

    // Mock toast functions
    toast.success = jest.fn();
    toast.error = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Simulate phone number input and OTP request
    fireEvent.change(screen.getByPlaceholderText("Enter your phone"), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByText("Send OTP"));

    await waitFor(() => {
      expect(forgotPasswordApi).toHaveBeenCalledWith({ phone: "1234567890" });
      expect(toast.success).toHaveBeenCalledWith("OTP sent successfully!");
    });

    // Simulate OTP and new password input and OTP verification
    fireEvent.change(screen.getByPlaceholderText("Enter valid OTP"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("Set New Password"), { target: { value: "newPassword123" } });
    fireEvent.click(screen.getByText("Verify OTP & Set Password"));

    await waitFor(() => {
      expect(verifyOtpApi).toHaveBeenCalledWith({
        phone: "1234567890",
        otp: "123456",
        newPassword: "newPassword123",
      });
      expect(toast.success).toHaveBeenCalledWith("Password updated successfully!");
    });
  });

  it("should handle OTP request error", async () => {
    const mockErrorResponse = {
      response: {
        status: 400,
        data: { message: "Failed to send OTP" },
      },
    };

    // Mock the API response
    forgotPasswordApi.mockRejectedValue(mockErrorResponse);

    // Mock toast functions
    toast.error = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Simulate phone number input and OTP request
    fireEvent.change(screen.getByPlaceholderText("Enter your phone"), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByText("Send OTP"));

    await waitFor(() => {
      expect(forgotPasswordApi).toHaveBeenCalledWith({ phone: "1234567890" });
      expect(toast.error).toHaveBeenCalledWith("Failed to send OTP");
    });
  });
});
