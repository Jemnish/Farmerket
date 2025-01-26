// AccountSettings.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountSettings from "./AccountSettings";
import { updateUserApi, userDetailsApi, deleteUserApi } from "../../api/Api";
import { toast } from "react-toastify";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../api/Api", () => ({
  updateUserApi: jest.fn(),
  userDetailsApi: jest.fn(),
  deleteUserApi: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AccountSettings Component", () => {
  const mockUser = {
    _id: "user1",
    fullname: "John Doe",
    phone: "1234567890",
    username: "johndoe",
  };

  beforeEach(() => {
    localStorage.setItem("userData", JSON.stringify({ _id: "user1" }));
    userDetailsApi.mockResolvedValue({
      data: { success: true, userData: mockUser },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch and display user details on mount", async () => {
    render(<AccountSettings />);

    await waitFor(() => {
      expect(userDetailsApi).toHaveBeenCalledWith({ userId: "user1" });
      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("1234567890")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("johndoe")).toBeInTheDocument();
    });
  });
});
