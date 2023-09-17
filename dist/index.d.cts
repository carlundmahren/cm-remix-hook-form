import * as react_hook_form from 'react-hook-form';
import { FieldValues, Resolver, FieldErrors, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { SubmitFunction, FetcherWithComponents } from '@remix-run/react';
import React from 'react';
import { FieldValues as FieldValues$1, UseFormProps, Path, RegisterOptions, FormState, UseFormReturn } from 'react-hook-form/dist/types';

declare const getFormDataFromSearchParams: (request: Pick<Request, "url">) => Record<any, any>;
/**
 * Parses the data from an HTTP request and validates it against a schema. Works in both loaders and actions, in loaders it extracts the data from the search params.
 * In actions it extracts it from request formData.
 *
 * @async
 * @param {Request} request - An object that represents an HTTP request.
 * @param validator - A function that resolves the schema.
 * @returns A Promise that resolves to an object containing the validated data or any errors that occurred during validation.
 */
declare const getValidatedFormData: <T extends FieldValues>(request: Request, resolver: Resolver) => Promise<{
    receivedValues: Record<any, any>;
    errors: FieldErrors<T>;
    data: undefined;
} | {
    receivedValues: Record<any, any>;
    errors: undefined;
    data: T;
}>;
/**
 * Helper method used in actions to validate the form data parsed from the frontend using zod and return a json error if validation fails.
 * @param data Data to validate
 * @param resolver Schema to validate and cast the data with
 * @returns Returns the validated data if successful, otherwise returns the error object
 */
declare const validateFormData: <T extends FieldValues>(data: any, resolver: Resolver) => Promise<{
    errors: FieldErrors<T>;
    data: undefined;
} | {
    errors: undefined;
    data: T;
}>;
/**
  Creates a new instance of FormData with the specified data and key.
  @template T - The type of the data parameter. It can be any type of FieldValues.
  @param {T} data - The data to be added to the FormData. It can be either an object of type FieldValues.
  @param {string} [key="formData"] - The key to be used for adding the data to the FormData.
  @returns {FormData} - The FormData object with the data added to it.
*/
declare const createFormData: <T extends FieldValues>(data: T, key?: string) => FormData;
/**
Parses the specified Request object's FormData to retrieve the data associated with the specified key.
@template T - The type of the data to be returned.
@param {Request} request - The Request object whose FormData is to be parsed.
@param {string} [key="formData"] - The key of the data to be retrieved from the FormData.
@returns {Promise<T>} - A promise that resolves to the data of type T.
@throws {Error} - If no data is found for the specified key, or if the retrieved data is not a string.
*/
declare const parseFormData: <T extends unknown>(request: Request, key?: string) => Promise<T>;

type SubmitFunctionOptions = Parameters<SubmitFunction>[1];
interface UseRemixFormOptions<T extends FieldValues$1> extends UseFormProps<T> {
    submitHandlers?: {
        onValid?: SubmitHandler<T>;
        onInvalid?: SubmitErrorHandler<T>;
    };
    submitConfig?: SubmitFunctionOptions;
    submitData?: FieldValues$1;
    fetcher?: FetcherWithComponents<T>;
}
declare const useRemixForm: <T extends FieldValues$1>({ submitHandlers, submitConfig, submitData, fetcher, ...formProps }: UseRemixFormOptions<T>) => {
    handleSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    register: (name: Path<T>, options?: RegisterOptions<T> | undefined) => {
        defaultValue: any;
        onChange: react_hook_form.ChangeHandler;
        onBlur: react_hook_form.ChangeHandler;
        ref: react_hook_form.RefCallBack;
        name: Path<T>;
        min?: string | number | undefined;
        max?: string | number | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        required?: boolean | undefined;
        disabled?: boolean | undefined;
    };
    formState: {
        dirtyFields: Partial<Readonly<react_hook_form.DeepMap<react_hook_form.DeepPartial<T>, boolean>>>;
        isDirty: boolean;
        isSubmitSuccessful: boolean;
        isSubmitted: boolean;
        isSubmitting: boolean;
        isValid: boolean;
        isValidating: boolean;
        touchedFields: Partial<Readonly<react_hook_form.DeepMap<react_hook_form.DeepPartial<T>, boolean>>>;
        submitCount: number;
        isLoading: boolean;
    };
    watch: react_hook_form.UseFormWatch<T>;
    getValues: react_hook_form.UseFormGetValues<T>;
    getFieldState: react_hook_form.UseFormGetFieldState<T>;
    setError: react_hook_form.UseFormSetError<T>;
    clearErrors: react_hook_form.UseFormClearErrors<T>;
    setValue: react_hook_form.UseFormSetValue<T>;
    trigger: react_hook_form.UseFormTrigger<T>;
    resetField: react_hook_form.UseFormResetField<T>;
    reset: react_hook_form.UseFormReset<T>;
    unregister: react_hook_form.UseFormUnregister<T>;
    control: react_hook_form.Control<T, any>;
    setFocus: react_hook_form.UseFormSetFocus<T>;
};
interface RemixFormProviderProps<T extends FieldValues$1> extends Omit<UseFormReturn<T>, "handleSubmit" | "formState"> {
    children: React.ReactNode;
    handleSubmit: any;
    register: any;
    formState: Omit<FormState<T>, "errors">;
}
declare const RemixFormProvider: <T extends FieldValues$1>({ children, ...props }: RemixFormProviderProps<T>) => JSX.Element;
declare const useRemixFormContext: <T extends FieldValues$1>() => {
    handleSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    watch: react_hook_form.UseFormWatch<T>;
    getValues: react_hook_form.UseFormGetValues<T>;
    getFieldState: react_hook_form.UseFormGetFieldState<T>;
    setError: react_hook_form.UseFormSetError<T>;
    clearErrors: react_hook_form.UseFormClearErrors<T>;
    setValue: react_hook_form.UseFormSetValue<T>;
    trigger: react_hook_form.UseFormTrigger<T>;
    formState: FormState<T>;
    resetField: react_hook_form.UseFormResetField<T>;
    reset: react_hook_form.UseFormReset<T>;
    unregister: react_hook_form.UseFormUnregister<T>;
    control: react_hook_form.Control<T, any>;
    register: react_hook_form.UseFormRegister<T>;
    setFocus: react_hook_form.UseFormSetFocus<T>;
};

export { RemixFormProvider, SubmitFunctionOptions, UseRemixFormOptions, createFormData, getFormDataFromSearchParams, getValidatedFormData, parseFormData, useRemixForm, useRemixFormContext, validateFormData };
