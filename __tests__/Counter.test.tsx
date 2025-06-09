import Counter, { CounterChild } from "@/components/Counter";
import { CounterProvider } from "@/context/CounterContext";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Counter", () => {
  it("should display initial count of zero", () => {
    render(<Counter />);
    expect(screen.getByTestId("counter-value").props.children).toBe(0);
  });

  it("should increment count when increment button is pressed", () => {
    render(<Counter />);
    const incrementButton = screen.getByTestId("increment-button");

    fireEvent.press(incrementButton);

    expect(screen.getByTestId("counter-value").props.children).toBe(1);
  });

  // Add to Counter.test.js
  it("should decrement count when decrement button is pressed", () => {
    render(<Counter />);
    const decrementButton = screen.getByTestId("decrement-button");
    const incrementButton = screen.getByTestId("increment-button");

    // First increment to 1
    fireEvent.press(incrementButton);
    // Then decrement back to 0
    fireEvent.press(decrementButton);

    expect(screen.getByTestId("counter-value").props.children).toBe(0);
  });
});


/*  */
const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: CounterProvider, ...options }); 

describe("CounterChild", () => {
  it("should display initial count of zero", () => {
    customRender(<CounterChild />);
    expect(screen.getByTestId("counter-value").props.children).toBe(0);
  });

  it("should increment count when increment button is pressed", () => {
    customRender(<CounterChild />);
    const incrementButton = screen.getByTestId("increment-button");

    fireEvent.press(incrementButton);

    expect(screen.getByTestId("counter-value").props.children).toBe(1);
  });

  // Add to Counter.test.js
  it("should decrement count when decrement button is pressed", () => {
    customRender(<CounterChild />);
    const decrementButton = screen.getByTestId("decrement-button");
    const incrementButton = screen.getByTestId("increment-button");

    // First increment to 1
    fireEvent.press(incrementButton);
    // Then decrement back to 0
    fireEvent.press(decrementButton);

    expect(screen.getByTestId("counter-value").props.children).toBe(0);
  });
});
