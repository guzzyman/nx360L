import dfnFormat from "date-fns/format";
import { dateMonths } from "./Constants";
import * as yup from "yup";
import currencyjs from "currency.js";

export function formatTableDate(date) {
  return dfnFormat(new Date(date), "dd MMM, yyyy");
}

export function formatCurrencyToNumber(string = "") {
  return string.toString().replace(/,/g, "");
}

export function formatNumber(n = "") {
  return n
    .toString()
    .replace(/^0|\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatNumberToCurrency(number = "", decimalPlace = false) {
  let value = number.toString();
  const decimalPosition = value.indexOf(".");
  if (decimalPosition >= 0) {
    let leftSide = formatNumber(value.substring(0, decimalPosition));
    let rightSide = formatNumber(value.substring(decimalPosition));
    if (decimalPlace) {
      rightSide += "00";
    }

    rightSide = rightSide.substring(0, 2);
    value = leftSide + "." + rightSide;
  } else {
    value = formatNumber(value);
    if (decimalPlace) {
      value += ".00";
    }
  }
  return value;
}

/**
 * handle both negative and positive number
 * @param {number} number
 * @param {boolean} decimalPlace
 * @returns
 */
export function formatNumberToCurrency2(number = "", decimalPlace = false) {
  return number.toLocaleString("en-GB", {
    ...(decimalPlace ? { minimumFractionDigits: 2 } : {}),
  });
}

export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

export function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const newTarget = [...target];
    for (const key in source) {
      if (typeof source[key] === "object") {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] = source[key] || newTarget[key];
      }
    }
  } else if (isObject(target) && isObject(source)) {
    const newTarget = { ...target };
    for (const key in source) {
      if (isObject(source[key])) {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] = source[key] || newTarget[key];
      }
    }
    return newTarget;
  }
  return undefined;
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    /* eslint-disable no-self-compare */
    return x !== x && y !== y;
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * @template C
 * @param {C} callback
 * @param {number} wait
 * @returns {C & {flush: Function, cancel: Function}}
 */
export function debounce(callback, wait = 0) {
  let debounceTimer;
  let triggerArgs;
  let triggerThis;

  function trigger(...arg) {
    triggerArgs = arg;
    triggerThis = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
    }, wait);
  }

  trigger.cancel = () => clearTimeout(debounceTimer);
  trigger.flush = () => {
    clearTimeout(debounceTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger;
}

export function throttle(callback, wait = 0) {
  let throttleTimer;
  let triggerArgs;
  let triggerThis;
  function trigger() {
    triggerArgs = arguments;
    triggerThis = this;
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
      throttleTimer = false;
    }, wait);
  }

  trigger.cancel = () => clearTimeout(throttleTimer);
  trigger.flush = () => {
    clearTimeout(throttleTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger;
}

export function objectToFormData(data) {
  const fd = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const arrData of data[key]) {
        fd.append(key, arrData);
      }
    } else {
      fd.set(key, data[key]);
    }
  }
  return fd;
}

export function arrayObjectToFormData(form) {
  const fd = new FormData();
  console.log(
    "Array.isArray(form)",
    Array.isArray(form),
    typeof form === Object
  );
  // for (let key in form) {
  //   console.log("form key", form[key])
  //   Array.isArray(form)
  //       ? form.forEach((value) => {
  //         // formData.append(key + '[]', value)
  //         for (const i in value) {
  //           console.log("value[i]",value[i], i)
  //           formData.set(i, value[i]);
  //         }
  //       })
  //       : formData.append(key, form[key]);
  for (var i = 0, valuePair; (valuePair = form[i]); i++)
    console.log("valuePair", valuePair);
  // for (var j in valuePair) formData.append(j, valuePair[j]);
  for (const key in Object.fromEntries(valuePair)) {
    console.log("key", key);
    fd.append(key, valuePair[key]);
    fd.set(key, valuePair[i]);
  }
  // for (const key in data) {
  //   fd.set(key, data[key]);
  // }
  return fd;
}

/**
 *
 * @param {Date | string | number} from
 * @param {Date | string | number} to
 */
export function getCountdown(from, to) {
  const oneSecondInMilli = 1000,
    oneMinuteInMilli = oneSecondInMilli * 60,
    oneHourInMilli = oneMinuteInMilli * 60,
    oneDayInMilli = oneHourInMilli * 24;

  const _from = new Date(from),
    _to = new Date(to),
    _fromTime = _from.getTime(),
    _toTime = _to.getTime(),
    distance = _toTime - _fromTime;

  const days = Math.floor(distance / oneDayInMilli),
    hours = Math.floor((distance % oneDayInMilli) / oneHourInMilli),
    minutes = Math.floor((distance % oneHourInMilli) / oneMinuteInMilli),
    seconds = Math.floor((distance % oneMinuteInMilli) / oneSecondInMilli);

  return { days, hours, minutes, seconds };
}

/**
 * @template {{[x: string]: any}} T
 * @param {URLSearchParams} searchParams
 * @param {T} params
 * @returns {T}
 */
export function urlSearchParamsExtractor(searchParams, params = {}) {
  if (searchParams && params) {
    const result = {};
    for (const key in params) {
      const value = searchParams.get(key);
      result[key] = value || params[key];
    }
    return result;
  }
  return params;
}

/**
 * @template {{}} T
 * @param {T} obj
 * @param {string} desc
 */
export function objectAccessor(obj, desc) {
  const arr = desc ? desc.split(".") : [];
  let result = obj;
  while (arr.length && (result = result?.[arr.shift()]));
  return result;
}

/**
 * @template {{}} T
 * @param {T} values
 * @param {{allowEmptyArray: boolean}} options
 * @returns
 */
export function removeEmptyProperties(values, options = {}) {
  const { allowEmptyArray } = options;
  const newTarget = Array.isArray(values) ? [] : isObject(values) ? {} : values;

  if (typeof newTarget === "object") {
    for (const key in values) {
      const value = values[key];
      if (
        (Array.isArray(value) && (allowEmptyArray || value.length)) ||
        (isObject(value) && Object.entries(value).length !== 0)
      ) {
        newTarget[key] =
          value instanceof File ? value : removeEmptyProperties(value);
      } else if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !Array.isArray(value) &&
        !isObject(value)
      ) {
        newTarget[key] = removeEmptyProperties(value);
      }
    }
  }
  return newTarget;
}

/**
 * Convert file to base64.
 * @param {*} file
 * @returns
 */
export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load something...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

/**
 *
 * @param {Array} errors
 * @returns
 */
export const getUserErrorMessage = (errors) => {
  return errors?.[0]?.defaultUserMessage;
};

/**
 * generate random UUID4.
 * @returns
 */
export const generateUUIDV4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * format stringified number which length is less than 10 to DD e.g 02.
 * @param {number} number
 * @returns
 */
function formatNumberToDD(number) {
  let suffix = "0";
  let numberStr = number.toString();
  if (numberStr.length === 1) {
    numberStr = suffix.concat(numberStr);
  }
  return numberStr;
}

/**
 *
 * @param {Array} date
 * @returns
 */
export const parseDateToString = (date) => {
  const year = date?.[0] || "";
  const month = dateMonths[date?.[1]] || "";
  const day = date?.[2] || "";

  let seperator = Array.isArray(date) && date.length ? " " : "";
  let newDate =
    formatNumberToDD(day) +
    seperator +
    formatNumberToDD(month) +
    seperator +
    year;

  return newDate || null;
};

/**
 * Remove base64 meta description
 * @param {string} base64
 * @returns
 */
export const removeBase64Meta = (base64) => {
  let base64Arr = base64?.split(",");
  let base64Link = base64Arr?.[1] || "";
  if (base64Link === undefined) {
    if (base64Arr[0].length >= 1) {
      base64Link = base64Arr[0];
    }
    base64Link = "";
  }
  return base64Link;
};

/**
 *
 * @param {string} dataUrl
 * @param {string} fileName
 * @returns File
 */
export async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, {
    type: `${blob?.type.toLowerCase() || ""}`,
  });
}

export function getTextFieldFormikProps(formik, key) {
  return {
    ...formik.getFieldProps(key),
    error: !!formik.touched?.[key] && !!formik.errors?.[key],
    helperText: !!formik.touched?.[key] && formik.errors?.[key],
    focused: formik.values?.[key],
  };
}

export function getCheckFieldFormikProps(
  formik,
  key,
  checkedValue = true
  // unCheckedValue = false
) {
  const textFieldProps = getTextFieldFormikProps(formik, key);
  // if (key === "allowAttributeConfiguration") {
  //   console.log(textFieldProps.value);
  // }
  const value =
    typeof checkedValue === "boolean"
      ? !!textFieldProps.value
      : textFieldProps.value;
  return {
    ...textFieldProps,
    value: value,
    checked: value === checkedValue,
  };
  // return {
  //   checked: !!formik.values[key],
  //   onChange: (e) => formik.setFieldValue(key, e.target.checked),
  // };
}

export function yupFileSchema(message) {
  return yup.mixed().test(
    "isFile",
    // eslint-disable-next-line no-template-curly-in-string
    message || "${path} not a file",
    (value) => value && value instanceof File
  );
}

export function byteToMegaByte(byte) {
  const _byte = parseFloat(byte);
  if (_byte) {
    return currencyjs(_byte).divide(1024).divide(1024).value;
  }
  return 0;
}

/**
 *
 * @param {Blob} blob
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    } else {
      resolve("");
    }
  });
}

/**
 *
 * @param {string} dataUrl
 * @returns
 */
export function getBase64FileType(dataUrl) {
  if (dataUrl === undefined) {
    return "";
  }
  const fileType = dataUrl.substring(
    dataUrl.indexOf("/") + 1,
    dataUrl.indexOf(";base64")
  );
  return fileType;
}

export function downloadFile(blob, fileName = "file") {
  if (blob instanceof Blob) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
}
/**
 *
 * @param {any[]} values
 * @param {{falsyValues: any[], truthyValues: any[]}} options
 * @returns
 */
export function getTruthyValue(values = [], options = {}) {
  const { truthyValues = [], falsyValues = [] } = options || {};
  return values.find((value) => {
    if (truthyValues.includes(value)) {
      return true;
    }
    if (falsyValues.includes(value)) {
      return false;
    }
    return !!value;
  });
}

/**
 *
 * @param {any[]} values
 * @param {{falsyValues: any[], truthyValues: any[]}} options
 * @returns
 */
export function getTruthyValues(values = [], options = {}) {
  return values.filter((value) => !!getTruthyValue([value], options));
}

/**
 *
 * @param {string} str
 * @returns Boolean
 */
export function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

/**
 *
 * @param {number} bytes
 * @param {number} decimals
 * @returns
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function configureRoutes(routes = [], options = {}) {
  const { parentPath } = options;
  return routes.map(configure);
  function configure(route) {
    const Element = route.element;
    const element =
      Element.$$typeof === Symbol.for("react.element") ? Element : <Element />;
    const configured = { ...route, element };
    if (configured.path) {
      configured.path = configured.path.replace(new RegExp(parentPath), "");
    }
    if (route.children?.length) {
      return { ...configured, children: route.children.map(configure) };
    }
    return configured;
  }
}

/**
 * @template T
 * @param {T} object
 * @param {string[]} exclusions
 * @returns
 */
export function excludeProperties(object, exclusions = []) {
  let _object = { ...object };
  for (const exclusion of exclusions) {
    _object = exclude(_object, exclusion.split("."));
  }
  return _object;

  function exclude(obj, nestedProperties) {
    const key = nestedProperties.shift();
    if (!nestedProperties.length) {
      delete obj[key];
      return obj;
    }
    return exclude(obj[key], nestedProperties);
  }
}
