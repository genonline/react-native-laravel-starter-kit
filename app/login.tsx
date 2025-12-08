import { login } from "@/api/auth";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useSession } from "@/context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Device from "expo-device";
import { Link } from "expo-router";
import { AlertTriangle, CircleAlert } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import colors from "tailwindcss/colors";
import { z } from "zod";

export default function LoginScreen() {
  const { setSession } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const toast = useToast();

  const loginSchema = z.object({
    email: z
      .email({ error: "This doesn't look like a proper email address" })
      .min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  type LoginSchemaType = z.infer<typeof loginSchema>;

  const {
    setError,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const handleKeyPress = () => {
    // Keyboard.dismiss();
    handleSubmit(onSubmit);
  };

  const onSubmit = async (form: LoginSchemaType) => {
    await login({
      email: form.email,
      password: form.password,
      device_name: `${Device.deviceName} - ${Device.osName} ${Device.osVersion}`,
    })
      .then(async (response) => {
        reset();
        // set session with token
        setSession(response);
        console.log("onSubmit.then(): ", response);
      })
      .catch((error) => {
        if (error.validationErrors) {
          console.log("onSubmit.validationErrors: ", error);
          // set form validation errors
          for (const key in error.validationErrors) {
            setError(key as keyof LoginSchemaType, {
              type: "manual",
              message: error.validationErrors[key],
            });
          }
        } else {
          // non validation errors
          toast.show({
            placement: "top",
            duration: 10000,
            render: ({ id }) => {
              return (
                <Toast nativeID={id} variant="solid" action="error">
                  <HStack space="lg">
                    <Icon as={CircleAlert} className="text-white mt-1" />
                    <VStack space="xs">
                      <ToastTitle className="font-semibold text-xl">
                        Error!
                      </ToastTitle>
                      <ToastDescription size="sm">
                        Something major went wrong!
                      </ToastDescription>
                    </VStack>
                  </HStack>
                </Toast>
              );
            },
          });
          // non validation errors
          //   throw Error("Major Server Error - Login", error);
        }
      });
  };

  return (
    <View className="flex justify-center h-full">
      <Card size="md" className="m-3">
        <VStack space="xl">
          <Heading size="2xl">Log in to your account</Heading>
          <Text className="mt-0">Enter your email and password to log in</Text>
          <FormControl isInvalid={!!errors?.email} className="w-full">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({ email: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    aria-label="username"
                    placeholder="email@example.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* Password Field */}
          <FormControl isInvalid={!!errors.password} className="w-full">
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({ password: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    aria-label="password"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                  <InputSlot onPress={handleShowPasswordState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* Forgot Password Link */}
          <Link href={"/forgot-password"} className="ml-auto">
            <LinkText size="sm" className="text-black dark:text-white">
              Forgot Password?
            </LinkText>
          </Link>

          {/* Login Button */}
          <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
            {isSubmitting && <ButtonSpinner color={colors.gray[400]} />}
            <ButtonText>Log in</ButtonText>
          </Button>

          {/* Don't have an account? */}
          <HStack className="m-auto">
            <Text className="mr-2">Don&#39;t have an account?</Text>
            <Link href={"/register"}>
              <LinkText className="text-black dark:text-white">
                Sign up
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </Card>
    </View>
  );
}
