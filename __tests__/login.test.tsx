import LoginScreen from "@/app/login";
import { useToast } from "@/components/ui/toast";
// import { useToast } from "@/components/ui/toast";
// import {useToast} from "@/__mocks__/@gluestack-ui/toast"
import { render, screen, userEvent } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

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

// mock async storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  multiMerge: jest.fn(() => Promise.resolve()),
}));

// jest.mock("@/components/ui/toast", () => ({
//   useToast: jest.fn(),
// }));

jest.mock("@/components/ui/toast", () => ({
  Toast: jest.fn(({ children }) => (
    <div data-testid="mock-toast">{children}</div>
  )),
  ToastTitle: jest.fn(({ children }) => (
    <span data-testid="mock-toast-title">{children}</span>
  )),
  ToastDescription: jest.fn(({ children }) => (
    <p data-testid="mock-toast-description">{children}</p>
  )),
  useToast: jest.fn(() => ({
    show: jest.fn(),
    close: jest.fn(),
    closeAll: jest.fn(),
    isActive: jest.fn(() => false),
  })),
  ToastProvider: jest.fn(({ children }) => <>{children}</>),
}));

// export const useToast = jest.fn(() => ({
//   show: jest.fn(),
//   close: jest.fn(),
//   closeAll: jest.fn(),
// }));

// export const createToastHook = jest.fn(() => ({
//   show: jest.fn(),
//   close: jest.fn(),
//   closeAll: jest.fn(),
// }));

// export const createToast = jest.fn(() => ({
//   show: jest.fn(),
//   close: jest.fn(),
//   closeAll: jest.fn(),
// }));
// export const useToast = jest.fn(() => ({
//   show: jest.fn(),
//   close: jest.fn(),
//   closeAll: jest.fn(),
// }));

test("Login Screen Renders Correctly", () => {
  render(<LoginScreen />);

  expect(screen.getByText("Log in to your account")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("email@example.com")).toBeOnTheScreen();
  expect(screen.getByPlaceholderText("Password")).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "Log in" })).toBeOnTheScreen();
});

test("User can sign in with correct credentials", async () => {
  const user = userEvent.setup();
  render(<LoginScreen />);

  expect(screen.getByText("Log in to your account")).toBeOnTheScreen();

  await user.type(
    screen.getByPlaceholderText("email@example.com"),
    "user@example.com"
  );
  await user.type(screen.getByPlaceholderText("Password"), "password");
  await user.press(screen.getByRole("button", { name: "Log in" }));

  // console.log(screen.toJSON());
  // await waitForElementToBeRemoved(() =>
  //   screen.getByText("Log in to your account")
  // );
  // expect(screen.queryByText("Log in to your account")).not.toBeOnTheScreen();
});

test("should show zod validation error messages", async () => {
  const user = userEvent.setup();
  render(<LoginScreen />);

  await user.press(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Invalid email")).toBeOnTheScreen();
  expect(screen.getByText("Password is required")).toBeOnTheScreen();
});

test("should show error message when invalid credentials provided", async () => {
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

  // expect(
  //   screen.getByText("The provided credentials are incorrect")
  // ).toBeOnTheScreen();

  expect(
    await screen.findByText("The provided credentials are incorrect")
  ).toBeOnTheScreen();
});

test.skip("should display modal on 500 server error", async () => {
  // const toast = useToast();
  const mockShowToast = useToast().show;
  // setup server response
  server.use(
    http.post(`${API_BASE_URL}/login`, () => {
      return HttpResponse.json(null, { status: 500 });
    })
  );
  // setup user
  const user = userEvent.setup();

  render(<LoginScreen />);

  //   const toast = useToast();

  await user.type(
    screen.getByPlaceholderText("email@example.com"),
    "user@example.com"
  );
  await user.type(screen.getByPlaceholderText("Password"), "password");
  await user.press(screen.getByRole("button", { name: "Log in" }));

  expect(mockShowToast).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Error!",
      description: "Something major went wrong!",
    })
  );

  expect().toThrow();

  //   expect(
  //     await screen.findByText("Something major went wrong!")
  //   ).toBeOnTheScreen();
});
