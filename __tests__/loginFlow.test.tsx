import { renderRouter, screen } from "expo-router/testing-library";

import IndexScreen from "@/app/(tabs)";
import RootLayout from "@/app/_layout";
import LoginScreen from "@/app/login";

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

// jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
//   useColorScheme: jest.fn(() => "light"), // Mocking useColorScheme to always return 'light'
// }));

// jest.mock("@react-navigation/native", () => ({
//   getColorScheme: jest.fn(() => "light"), // Or 'dark' or 'no-preference'
// }));

// Mock the root layout component or whatever you use to wrap your app logic
// const RootLayout = require("../app/_layout").default;

// Define the routes for the in-memory router
const mockRoutes = {
  _layout: RootLayout,
  login: LoginScreen,
  "(tabs)/index": IndexScreen,
};

describe("App Main Entry Point", () => {
  it("renders the initial route and mocks API calls successfully", async () => {
    // Renders the in-memory router starting at the initial URL (e.g., '/')
    renderRouter(mockRoutes, { initialUrl: "/" });

    // Verify loading state first if applicable
    // expect(screen.getByTestId("welcome-text")).toHaveTextContent(
    //   "Welcome, Loading..."
    // );

    expect(screen.getByText("Log in to your account")).toBeOnTheScreen();

    // Wait for the asynchronous network request and subsequent re-render
    // await waitFor(() => {
    //   // MSW intercepts the request and returns "Test User"
    //   expect(screen.getByTestId("welcome-text")).toHaveTextContent(
    //     "Welcome, Test"
    //   );
    // });
  });
});
