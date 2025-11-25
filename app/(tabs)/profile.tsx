import { updateUser } from "@/api/user";
import ToggleTheme from "@/components/ToggleTheme";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
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
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useSession } from "@/context/authContext";
import { useUser } from "@/context/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CircleAlert } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView } from "react-native";
import colors from "tailwindcss/colors";
import { z } from "zod";

export default function ProfileScreen() {
  const user = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { signOut } = useSession();

  const [showModal, setShowModal] = useState(false);

  const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email(),
  });

  type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

  const {
    setError,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    values: user,
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (form: UpdateUserSchemaType) => {
    await updateUser({
      name: form.name,
      email: form.email,
    })
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ["user"] });

        // Success Toast
        toast.show({
          placement: "top",
          duration: 5000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="solid" action="success">
                <HStack space="lg">
                  <VStack space="xs">
                    <ToastDescription size="md">
                      Your profile has been updated!
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
            setError(key as keyof UpdateUserSchemaType, {
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
          throw Error("Update User Error", error);
        }
      });
  };

  return (
    <ScrollView className="m-3" contentContainerStyle={{ flexGrow: 1 }}>
      <VStack space="lg">
        <Card className="flex flex-row gap-3 content-center">
          <Avatar size="md">
            <AvatarImage></AvatarImage>
            <AvatarFallbackText>{user.name}</AvatarFallbackText>
          </Avatar>
          <VStack>
            <Heading>{user.name}</Heading>
            <Text>{user.email}</Text>
          </VStack>
        </Card>

        <Card>
          <VStack space="xl">
            {/* Heading */}
            <VStack space="sm">
              <Heading size="2xl">Update profile</Heading>
              <Text className="mt-0">Update your account details</Text>
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
                      await updateUserSchema.parseAsync({ name: value });
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
                      await updateUserSchema.parseAsync({ email: value });
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
              <ButtonText>Update profile</ButtonText>
            </Button>
          </VStack>
        </Card>
        {/* Toggle Theme */}
        <ToggleTheme />
        {/* Log Out */}
        <Card>
          <Button
            className="ml-auto"
            onPress={() => {
              setShowModal(true);
            }}
          >
            <ButtonText>Log out</ButtonText>
          </Button>
        </Card>
      </VStack>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px]">
          <ModalBody className="mt-2 mb-4">
            <VStack space="xs">
              <Heading size="lg">Log out</Heading>
              <Text className="mt-0">Are you sure you want to log out?</Text>
            </VStack>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setShowModal(false);
              }}
              className="flex-grow"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              action="negative"
              onPress={() => {
                signOut();
              }}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>Log out</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
