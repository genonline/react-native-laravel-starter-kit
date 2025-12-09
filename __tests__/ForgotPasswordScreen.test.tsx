import ForgotPasswordScreen from "@/app/forgot-password";
import { render, screen, userEvent } from "@testing-library/react-native";

test("Forgot Password Screen Renders Correctly", () => {
  render(<ForgotPasswordScreen />);

  expect(screen.getByText("Forgot your password?")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("email@example.com")).toBeOnTheScreen();
  expect(
    screen.getByRole("button", { name: "Email password reset link" })
  ).toBeOnTheScreen();
});

test("Should show zod validation error messages", async () => {
  const user = userEvent.setup();

  render(<ForgotPasswordScreen />);

  await user.press(
    screen.getByRole("button", { name: "Email password reset link" })
  );

  expect(screen.getByText("Invalid email")).toBeOnTheScreen();
});
