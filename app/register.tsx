import { register } from "@/api/auth";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
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
import { CheckIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Link, LinkText } from "@/components/ui/link";
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
import { router } from "expo-router";
import { AlertTriangle, CircleAlert } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView, View } from "react-native";
import colors from "tailwindcss/colors";
import { z } from "zod";

export default function RegisterScreen() {
  const { setSession } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const toast = useToast();

  const signUpSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.email({ error: "Invalid email" }),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
      terms: z
        .boolean()
        .refine(
          (value) => value === true,
          "You must agree to the terms and conditions"
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type SignUpSchemaType = z.infer<typeof signUpSchema>;

  const {
    setError,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (form: SignUpSchemaType) => {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      device_name: `${Device.deviceName} - ${Device.osName} ${Device.osVersion}`,
    })
      .then(async (response) => {
        // reset form
        reset();
        // set session with token
        setSession(response);
        // redirct to dashboard
        router.replace("/");
      })
      .catch((error) => {
        if (error.validationErrors) {
          // set form validation errors
          for (const key in error.validationErrors) {
            setError(key as keyof SignUpSchemaType, {
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
          throw Error("Major Server Error - Register", error);
        }
      });
  };

  return (
    <ScrollView>
      <View className="flex justify-center h-full">
        <Card size="md" className="m-3">
          <VStack space="xl">
            {/* Heading */}
            <VStack space="sm">
              <Heading size="2xl">Create an account</Heading>
              <Text className="mt-0">
                Enter your details to create your account
              </Text>
            </VStack>
            {/* Name Field */}
            <FormControl isInvalid={!!errors?.name} className="w-full">
              <FormControlLabel>
                <FormControlLabelText>Name</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="name"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({ name: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Full name"
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
                  {errors?.name?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Email Field */}
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
                      await signUpSchema.parseAsync({ email: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
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
                      await signUpSchema.parseAsync({ password: value });
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
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                    <InputSlot
                      onPress={handleShowPasswordState}
                      className="pr-3"
                    >
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
            {/* Confirm Password Field */}
            <FormControl
              isInvalid={!!errors.confirmPassword}
              className="w-full"
            >
              <FormControlLabel>
                <FormControlLabelText>Confirm Password</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue=""
                name="confirmPassword"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({ confirmPassword: value });
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
                      placeholder="Confirm password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                    <InputSlot
                      onPress={handleShowPasswordState}
                      className="pr-3"
                    >
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.confirmPassword?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Terms Field */}
            <FormControl isInvalid={!!errors.terms} className="w-full">
              <FormControlLabel>
                <FormControlLabelText>Terms</FormControlLabelText>
              </FormControlLabel>
              <Controller
                defaultValue={false}
                name="terms"
                control={control}
                rules={{
                  validate: async (value) => {
                    try {
                      await signUpSchema.parseAsync({ terms: value });
                      return true;
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Checkbox
                    size="md"
                    value=""
                    isChecked={value}
                    onChange={onChange}
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>
                      I accept the Terms of Use & Privacy Policy
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertTriangle} />
                <FormControlErrorText>
                  {errors?.terms?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Button */}
            <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
              {isSubmitting && <ButtonSpinner color={colors.gray[400]} />}
              <ButtonText>Create account</ButtonText>
            </Button>
            {/* Already Have Account Link */}
            <HStack className="m-auto">
              <Text className="mt-0">Already have an account?</Text>
              <Link className="ml-1" onPress={() => router.push("/login")}>
                <LinkText className="text-black dark:text-white">
                  Sign in
                </LinkText>
              </Link>
            </HStack>
          </VStack>
        </Card>
      </View>
    </ScrollView>
  );
}
