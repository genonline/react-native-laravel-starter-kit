import { forgotPassword } from "@/api/auth";
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
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AlertTriangle, CircleAlert } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import colors from "tailwindcss/colors";
import { z } from "zod";

export default function ForgotPasswordScreen() {
  const toast = useToast();
  const router = useRouter();

  const forgotPasswordSchema = z.object({
    email: z.email({ error: "Invalid email" }),
  });

  type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

  const {
    setError,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (form: ForgotPasswordSchemaType) => {
    await forgotPassword({
      email: form.email,
    })
      .then(async (response) => {
        // reset form
        reset();

        // toast success message
        toast.show({
          placement: "top",
          duration: 15000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="solid" action="success">
                <HStack space="lg">
                  <VStack space="xs">
                    <ToastDescription size="md">
                      A reset link will be sent if the account exists.
                    </ToastDescription>
                  </VStack>
                </HStack>
              </Toast>
            );
          },
        });
      })
      .catch((error) => {
        if (error.validationErrors) {
          // set form validation errors
          for (const key in error.validationErrors) {
            setError(key as keyof ForgotPasswordSchemaType, {
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
          throw Error("Major Server Error - Forgot Password", error);
        }
      });
  };

  return (
    <View className="flex justify-center h-full">
      <Card size="md" className="m-3">
        <VStack space="xl">
          {/* Heading */}
          <VStack space="sm">
            <Heading size="2xl">Forgot your password?</Heading>
            <Text>Enter your email to receive a password reset link</Text>
          </VStack>
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
                    await forgotPasswordSchema.parseAsync({ email: value });
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
          {/* Button */}
          <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
            {isSubmitting && <ButtonSpinner color={colors.gray[400]} />}
            <ButtonText>Email password reset link</ButtonText>
          </Button>
          {/* Return to log in */}
          <HStack className="m-auto">
            <Text className="mt-0">Or, return to</Text>
            <Link className="ml-1" onPress={() => router.push("/login")}>
              <LinkText className="text-black dark:text-white">log in</LinkText>
            </Link>
          </HStack>
        </VStack>
      </Card>
    </View>
  );
}
