import LoginScreen from "@/app/login";
import { render, screen, userEvent } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Get api url
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Mock server Setup
const handlers = [
  http.post(`${API_BASE_URL}/login`, () => {
    return HttpResponse.json(SUCCESSFUL_LOGIN_RESPONSE);
  }),
];
// Setup a request interception server with the given request handlers.
const server = setupServer(...handlers);

// Log all server requests
server.events.on("request:start", ({ request }) => {
  console.log("Outgoing:", request.method, request.url);
});

// Enable API mocking via Mock Service Worker (MSW)
// warn if reqesting api we haven't mocked
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Disable API mocking after the tests are done
afterAll(() => server.close());

// data responses
const FAILED_LOGIN_RESPONSE = {
  message: "The provided credentials are incorrect",
  errors: {
    email: ["The provided credentials are incorrect"],
  },
};

const SUCCESSFUL_LOGIN_RESPONSE = {
  token: "30|fQGlCFepKg3P5VAUbCayLzdmBbg1IV3KhSeqNBSbf47c9d0f",
};

test("Login Screen Renders Correctly", () => {
  render(<LoginScreen />);

  expect(screen.getByText("Log in to your account")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("email@example.com")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("Password")).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "Log in" })).toBeOnTheScreen();
});

test("should show zod validation error messages", async () => {
  const user = userEvent.setup();

  render(<LoginScreen />);

  await user.press(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Invalid email")).toBeOnTheScreen();
  expect(screen.getByText("Password is required")).toBeOnTheScreen();
});

test("should show server error message when invalid credentials provided", async () => {
  // setup server response
  server.use(
    http.post(`${API_BASE_URL}/login`, () => {
      return HttpResponse.json(FAILED_LOGIN_RESPONSE, { status: 422 });
    })
  );

  // setup user
  const user = userEvent.setup();

  render(<LoginScreen />);

  expect(screen.getByText("Log in to your account")).toBeOnTheScreen();

  await user.type(
    screen.getByPlaceholderText("email@example.com"),
    "user@example.com"
  );
  await user.type(screen.getByPlaceholderText("Password"), "password");
  await user.press(screen.getByRole("button", { name: "Log in" }));

  expect(
    await screen.findByText("The provided credentials are incorrect")
  ).toBeOnTheScreen();
});
