// Buying.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Buying from "./Buying";
import { addtoCart } from "../../api/Api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../api/Api", () => ({
  addtoCart: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mocking useParams to provide a fake id
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

describe("Buying Component", () => {
  const mockProduct = {
    productPrice: "500",
  };

  beforeEach(() => {
    useParams.mockReturnValue({ id: "12345" });
    localStorage.setItem("userData", JSON.stringify({ _id: "user1" }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update state when input fields change", () => {
    render(<Buying product={mockProduct} />);

    const nameInput = screen.getByPlaceholderText("Full Name");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const addressInput = screen.getByPlaceholderText("Address");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(addressInput, { target: { value: "123 Street" } });

    expect(nameInput.value).toBe("John Doe");
    expect(phoneInput.value).toBe("1234567890");
    expect(addressInput.value).toBe("123 Street");
  });

  test("should call addtoCart and show success toast on valid submit", async () => {
    addtoCart.mockResolvedValue({ data: { success: true } });

    render(<Buying product={mockProduct} />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Phone"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Address"), { target: { value: "123 Street" } });

    fireEvent.click(screen.getByText("Add to Cart"));

    await waitFor(() => {
      expect(addtoCart).toHaveBeenCalledWith({
        userId: "user1",
        productId: "12345",
      });
      expect(toast.success).toHaveBeenCalledWith("Product added to cart");
    });
  });
});
