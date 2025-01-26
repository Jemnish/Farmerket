import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "./Login";
import { loginUserApi } from "../../api/Api";
import { useNavigate } from "react-router-dom";

// Mock the API call
jest.mock("../../api/Api");

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display an error toast on failed login", async () => {
    const mockResponse = {
      data: {
        success: false,
        message: "Invalid credentials!",
      },
    };
    loginUserApi.mockResolvedValue(mockResponse);

    toast.error = jest.fn();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        username: "user",
        password: "pass",
      });
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials!");
    });
  });

  it("should redirect to the correct page on successful login", async () => {
    const mockResponse = {
      data: {
        success: true,
        message: "Login successful!",
        token: "dummy-token",
        userData: { isAdmin: false },
      },
    };
    loginUserApi.mockResolvedValue(mockResponse);

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        username: "user",
        password: "pass",
      });
      expect(localStorage.getItem("token")).toBe("dummy-token");
      expect(localStorage.getItem("userData")).toBe(
        JSON.stringify({ isAdmin: false })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("should handle admin login and redirect to admin dashboard", async () => {
    const mockResponse = {
      data: {
        success: true,
        message: "Login successful!",
        token: "dummy-token",
        userData: { isAdmin: true },
      },
    };
    loginUserApi.mockResolvedValue(mockResponse);

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "adminpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        username: "admin",
        password: "adminpass",
      });
      expect(localStorage.getItem("token")).toBe("dummy-token");
      expect(localStorage.getItem("userData")).toBe(
        JSON.stringify({ isAdmin: true })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
    });
  });
});
