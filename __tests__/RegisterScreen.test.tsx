import RegisterScreen from "@/app/register";
import { render, screen, userEvent } from "@testing-library/react-native";

test("Register Screen Renders Correctly", () => {
  render(<RegisterScreen />);

  expect(screen.getByText("Create an account")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("Full name")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("email@example.com")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("Password")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("Confirm password")).toBeOnTheScreen();
  expect(
    screen.getByRole("button", { name: "Create account" })
  ).toBeOnTheScreen();
});

test("Should show zod validation error messages", async () => {
  const user = userEvent.setup();

  render(<RegisterScreen />);

  await user.press(screen.getByRole("button", { name: "Create account" }));

  expect(screen.getByText("Name is required")).toBeOnTheScreen();
  expect(screen.getByText("Invalid email")).toBeOnTheScreen();
  const passwordErrors = screen.getAllByText(
    "Password must be at least 8 characters"
  );
  expect(passwordErrors).toHaveLength(2);
  expect(
    screen.getByText("You must agree to the terms and conditions")
  ).toBeOnTheScreen();
});
