import {
  FetcherWithComponents,
  SubmitFunction,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import React from "react";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import type {
  FieldValues,
  FormState,
  Path,
  RegisterOptions,
  UseFormHandleSubmit,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form/dist/types";
import { createFormData } from "../utilities";

export type SubmitFunctionOptions = Parameters<SubmitFunction>[1];

export interface UseRemixFormOptions<T extends FieldValues>
  extends UseFormProps<T> {
  submitHandlers?: {
    onValid?: SubmitHandler<T>;
    onInvalid?: SubmitErrorHandler<T>;
  };
  submitConfig?: SubmitFunctionOptions;
  submitData?: FieldValues;
  fetcher?: FetcherWithComponents<T>;
}

export const useRemixForm = <T extends FieldValues>({
  submitHandlers,
  submitConfig,
  submitData,
  fetcher,
  ...formProps
}: UseRemixFormOptions<T>) => {
  const submit = fetcher?.submit ?? useSubmit();
  const data = fetcher?.data ?? useActionData();
  const methods = useForm<T>(formProps);

  // Submits the data to the server when form is valid
  const onSubmit = (data: T) => {
    submit(createFormData({ ...data, ...submitData }), {
      method: "post",
      ...submitConfig,
    });
  };
  const values = methods.getValues();
  const validKeys = Object.keys(values);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onInvalid = () => {};

  const formState = methods.formState;

  const {
    dirtyFields,
    isDirty,
    isSubmitSuccessful,
    isSubmitted,
    isSubmitting,
    isValid,
    isValidating,
    touchedFields,
    submitCount,
    isLoading,
  } = formState;

  return {
    ...methods,
    handleSubmit: methods.handleSubmit(
      submitHandlers?.onValid ?? onSubmit,
      submitHandlers?.onInvalid ?? onInvalid,
    ),
    register: (name: Path<T>, options?: RegisterOptions<T>) => ({
      ...methods.register(name, options),
      defaultValue: data?.defaultValues?.[name] ?? "",
    }),
    formState: {
      dirtyFields,
      isDirty,
      isSubmitSuccessful,
      isSubmitted,
      isSubmitting,
      isValid,
      isValidating,
      touchedFields,
      submitCount,
      isLoading,
    },
  };
};
interface RemixFormProviderProps<T extends FieldValues>
  extends Omit<UseFormReturn<T>, "handleSubmit" | "formState"> {
  children: React.ReactNode;
  handleSubmit: any;
  register: any;
  formState: Omit<FormState<T>, "errors">;
}

export const RemixFormProvider = <T extends FieldValues>({
  children,
  ...props
}: RemixFormProviderProps<T>) => {
  // @ts-ignore
  return <FormProvider {...props}>{children}</FormProvider>;
};

export const useRemixFormContext = <T extends FieldValues>() => {
  const methods = useFormContext<T>();
  return {
    ...methods,
    handleSubmit: methods.handleSubmit as any as ReturnType<
      UseFormHandleSubmit<T>
    >,
  };
};
