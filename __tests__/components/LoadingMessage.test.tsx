import LoadingMessageScreen from "@/components/LoadingMessageScreen";
import { render, screen } from "@testing-library/react-native";

test("It renders correctly", () => {
  render(<LoadingMessageScreen msg="Test String" />);

  expect(screen.getByText("Test String")).toBeOnTheScreen();
});
