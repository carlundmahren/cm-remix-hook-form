"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  RemixFormProvider: () => RemixFormProvider,
  createFormData: () => createFormData,
  getFormDataFromSearchParams: () => getFormDataFromSearchParams,
  getValidatedFormData: () => getValidatedFormData,
  parseFormData: () => parseFormData,
  useRemixForm: () => useRemixForm,
  useRemixFormContext: () => useRemixFormContext,
  validateFormData: () => validateFormData
});
module.exports = __toCommonJS(src_exports);

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
var import_react = require("@remix-run/react");
var import_react2 = __toESM(require("react"), 1);
var import_react_hook_form = require("react-hook-form");
var useRemixForm = ({
  submitHandlers,
  submitConfig,
  submitData,
  fetcher,
  ...formProps
}) => {
  var _a, _b, _c, _d;
  const actionSubmit = (0, import_react.useSubmit)();
  const actionData = (0, import_react.useActionData)();
  const submit = (_a = fetcher == null ? void 0 : fetcher.submit) != null ? _a : actionSubmit;
  const data = (_b = fetcher == null ? void 0 : fetcher.data) != null ? _b : actionData;
  const methods = (0, import_react_hook_form.useForm)(formProps);
  const navigation = (0, import_react.useNavigation)();
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
  return /* @__PURE__ */ import_react2.default.createElement(import_react_hook_form.FormProvider, { ...props }, children);
};
var useRemixFormContext = () => {
  const methods = (0, import_react_hook_form.useFormContext)();
  return {
    ...methods,
    handleSubmit: methods.handleSubmit
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RemixFormProvider,
  createFormData,
  getFormDataFromSearchParams,
  getValidatedFormData,
  parseFormData,
  useRemixForm,
  useRemixFormContext,
  validateFormData
});
