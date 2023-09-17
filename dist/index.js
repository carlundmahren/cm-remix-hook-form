// src/utilities/index.ts
var generateFormData = (formData) => {
  const outputObject = {};
  for (const [key, value] of formData.entries()) {
    const keyParts = key.split(".");
    let currentObject = outputObject;
    for (let i = 0; i < keyParts.length - 1; i++) {
      const keyPart = keyParts[i];
      if (!currentObject[keyPart]) {
        currentObject[keyPart] = /^\d+$/.test(keyParts[i + 1]) ? [] : {};
      }
      currentObject = currentObject[keyPart];
    }
    const lastKeyPart = keyParts[keyParts.length - 1];
    const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);
    if (lastKeyPartIsArray) {
      const key2 = lastKeyPart.replace(/\[\d*\]$|\[\]$/, "");
      if (!currentObject[key2]) {
        currentObject[key2] = [];
      }
      currentObject[key2].push(value);
    }
    if (!lastKeyPartIsArray) {
      if (/^\d+$/.test(lastKeyPart)) {
        currentObject.push(value);
      } else {
        currentObject[lastKeyPart] = value;
      }
    }
  }
  return outputObject;
};
var getFormDataFromSearchParams = (request) => {
  const searchParams = new URL(request.url).searchParams;
  return generateFormData(searchParams);
};
var isGet = (request) => request.method === "GET" || request.method === "get";
var getValidatedFormData = async (request, resolver) => {
  const data = isGet(request) ? getFormDataFromSearchParams(request) : await parseFormData(request);
  const validatedOutput = await validateFormData(data, resolver);
  return { ...validatedOutput, receivedValues: data };
};
var validateFormData = async (data, resolver) => {
  const { errors, values } = await resolver(
    data,
    {},
    { shouldUseNativeValidation: false, fields: {} }
  );
  if (Object.keys(errors).length > 0) {
    return { errors, data: void 0 };
  }
  return { errors: void 0, data: values };
};
var createFormData = (data, key = "formData") => {
  const formData = new FormData();
  const recurseData = (key2, value) => {
    if (value.length && value.length > 0 && value[0] instanceof File) {
      const file = value[0];
      formData.append(key2, file, file.name);
      delete data[key2];
    } else if (value instanceof Object) {
      Object.entries(value).forEach((inside) => {
        recurseData(`${key2}.${inside[0]}`, inside[1]);
      });
    }
  };
  if (data instanceof Object) {
    Object.entries(data).forEach(([key2, value]) => recurseData(key2, value));
  }
  const finalData = JSON.stringify(data);
  formData.append(key, finalData);
  return formData;
};
var parseFormData = async (request, key = "formData") => {
  const formData = await request.formData();
  const data = formData.get(key);
  if (!data) {
    return generateFormData(formData);
  }
  if (!(typeof data === "string")) {
    throw new Error("Data is not a string");
  }
  return JSON.parse(data);
};

// src/hook/index.tsx
import {
  useActionData,
  useNavigation,
  useSubmit
} from "@remix-run/react";
import React from "react";
import {
  FormProvider,
  useForm,
  useFormContext
} from "react-hook-form";
var useRemixForm = ({
  submitHandlers,
  submitConfig,
  submitData,
  fetcher,
  ...formProps
}) => {
  var _a, _b, _c, _d;
  const actionSubmit = useSubmit();
  const actionData = useActionData();
  const submit = (_a = fetcher == null ? void 0 : fetcher.submit) != null ? _a : actionSubmit;
  const data = (_b = fetcher == null ? void 0 : fetcher.data) != null ? _b : actionData;
  const methods = useForm(formProps);
  const navigation = useNavigation();
  const isSubmittingForm = navigation.state !== "idle" || fetcher && fetcher.state !== "idle";
  const onSubmit = (data2) => {
    submit(createFormData({ ...data2, ...submitData }), {
      method: "post",
      ...submitConfig
    });
  };
  const values = methods.getValues();
  const validKeys = Object.keys(values);
  const onInvalid = () => {
  };
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
    isLoading
  } = formState;
  return {
    ...methods,
    handleSubmit: methods.handleSubmit(
      (_c = submitHandlers == null ? void 0 : submitHandlers.onValid) != null ? _c : onSubmit,
      (_d = submitHandlers == null ? void 0 : submitHandlers.onInvalid) != null ? _d : onInvalid
    ),
    register: (name, options) => {
      var _a2, _b2;
      return {
        ...methods.register(name, options),
        defaultValue: (_b2 = (_a2 = data == null ? void 0 : data.defaultValues) == null ? void 0 : _a2[name]) != null ? _b2 : ""
      };
    },
    formState: {
      dirtyFields,
      isDirty,
      isSubmitSuccessful,
      isSubmitted,
      isSubmitting: isSubmittingForm || isSubmitting,
      isValid,
      isValidating,
      touchedFields,
      submitCount,
      isLoading
    }
  };
};
var RemixFormProvider = ({
  children,
  ...props
}) => {
  return /* @__PURE__ */ React.createElement(FormProvider, { ...props }, children);
};
var useRemixFormContext = () => {
  const methods = useFormContext();
  return {
    ...methods,
    handleSubmit: methods.handleSubmit
  };
};
export {
  RemixFormProvider,
  createFormData,
  getFormDataFromSearchParams,
  getValidatedFormData,
  parseFormData,
  useRemixForm,
  useRemixFormContext,
  validateFormData
};
