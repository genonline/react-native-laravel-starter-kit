import { render } from "@testing-library/react-native";

import RegisterScreen from "@/app/register";

describe("<RegisterScreen .>", () => {
  test.skip("Text renders correctly", () => {
    const { getByText } = render(<RegisterScreen />);

    getByText("Register Screen");
  });
});
