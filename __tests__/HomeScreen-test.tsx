import { render, screen } from "@testing-library/react-native";

import HomeScreen from "@/app/index";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    render(<HomeScreen />);

    expect(screen.getByTestId("home")).toHaveTextContent("Home 🧋");
  });
});
