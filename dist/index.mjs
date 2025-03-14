var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// generated/runtime.ts
var BASE_PATH = "https://api.jup.ag/swap/v1".replace(/\/+$/, "");
var Configuration = class {
  constructor(configuration = {}) {
    this.configuration = configuration;
  }
  set config(configuration) {
    this.configuration = configuration;
  }
  get basePath() {
    return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
  }
  get fetchApi() {
    return this.configuration.fetchApi;
  }
  get middleware() {
    return this.configuration.middleware || [];
  }
  get queryParamsStringify() {
    return this.configuration.queryParamsStringify || querystring;
  }
  get username() {
    return this.configuration.username;
  }
  get password() {
    return this.configuration.password;
  }
  get apiKey() {
    const apiKey = this.configuration.apiKey;
    if (apiKey) {
      return typeof apiKey === "function" ? apiKey : () => apiKey;
    }
    return void 0;
  }
  get accessToken() {
    const accessToken = this.configuration.accessToken;
    if (accessToken) {
      return typeof accessToken === "function" ? accessToken : () => __async(this, null, function* () {
        return accessToken;
      });
    }
    return void 0;
  }
  get headers() {
    return this.configuration.headers;
  }
  get credentials() {
    return this.configuration.credentials;
  }
};
var DefaultConfig = new Configuration();
var _BaseAPI = class _BaseAPI {
  constructor(configuration = DefaultConfig) {
    this.configuration = configuration;
    this.fetchApi = (url, init) => __async(this, null, function* () {
      let fetchParams = { url, init };
      for (const middleware of this.middleware) {
        if (middleware.pre) {
          fetchParams = (yield middleware.pre(__spreadValues({
            fetch: this.fetchApi
          }, fetchParams))) || fetchParams;
        }
      }
      let response = void 0;
      try {
        response = yield (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
      } catch (e) {
        for (const middleware of this.middleware) {
          if (middleware.onError) {
            response = (yield middleware.onError({
              fetch: this.fetchApi,
              url: fetchParams.url,
              init: fetchParams.init,
              error: e,
              response: response ? response.clone() : void 0
            })) || response;
          }
        }
        if (response === void 0) {
          if (e instanceof Error) {
            throw new FetchError(e, "The request failed and the interceptors did not return an alternative response");
          } else {
            throw e;
          }
        }
      }
      for (const middleware of this.middleware) {
        if (middleware.post) {
          response = (yield middleware.post({
            fetch: this.fetchApi,
            url: fetchParams.url,
            init: fetchParams.init,
            response: response.clone()
          })) || response;
        }
      }
      return response;
    });
    this.middleware = configuration.middleware;
  }
  withMiddleware(...middlewares) {
    const next = this.clone();
    next.middleware = next.middleware.concat(...middlewares);
    return next;
  }
  withPreMiddleware(...preMiddlewares) {
    const middlewares = preMiddlewares.map((pre) => ({ pre }));
    return this.withMiddleware(...middlewares);
  }
  withPostMiddleware(...postMiddlewares) {
    const middlewares = postMiddlewares.map((post) => ({ post }));
    return this.withMiddleware(...middlewares);
  }
  /**
   * Check if the given MIME is a JSON MIME.
   * JSON MIME examples:
   *   application/json
   *   application/json; charset=UTF8
   *   APPLICATION/JSON
   *   application/vnd.company+json
   * @param mime - MIME (Multipurpose Internet Mail Extensions)
   * @return True if the given MIME is JSON, false otherwise.
   */
  isJsonMime(mime) {
    if (!mime) {
      return false;
    }
    return _BaseAPI.jsonRegex.test(mime);
  }
  request(context, initOverrides) {
    return __async(this, null, function* () {
      const { url, init } = yield this.createFetchParams(context, initOverrides);
      const response = yield this.fetchApi(url, init);
      if (response && (response.status >= 200 && response.status < 300)) {
        return response;
      }
      throw new ResponseError(response, "Response returned an error code");
    });
  }
  createFetchParams(context, initOverrides) {
    return __async(this, null, function* () {
      let url = this.configuration.basePath + context.path;
      if (context.query !== void 0 && Object.keys(context.query).length !== 0) {
        url += "?" + this.configuration.queryParamsStringify(context.query);
      }
      const headers = Object.assign({}, this.configuration.headers, context.headers);
      Object.keys(headers).forEach((key) => headers[key] === void 0 ? delete headers[key] : {});
      const initOverrideFn = typeof initOverrides === "function" ? initOverrides : () => __async(this, null, function* () {
        return initOverrides;
      });
      const initParams = {
        method: context.method,
        headers,
        body: context.body,
        credentials: this.configuration.credentials
      };
      const overriddenInit = __spreadValues(__spreadValues({}, initParams), yield initOverrideFn({
        init: initParams,
        context
      }));
      let body;
      if (isFormData(overriddenInit.body) || overriddenInit.body instanceof URLSearchParams || isBlob(overriddenInit.body)) {
        body = overriddenInit.body;
      } else if (this.isJsonMime(headers["Content-Type"])) {
        body = JSON.stringify(overriddenInit.body);
      } else {
        body = overriddenInit.body;
      }
      const init = __spreadProps(__spreadValues({}, overriddenInit), {
        body
      });
      return { url, init };
    });
  }
  /**
   * Create a shallow clone of `this` by constructing a new instance
   * and then shallow cloning data members.
   */
  clone() {
    const constructor = this.constructor;
    const next = new constructor(this.configuration);
    next.middleware = this.middleware.slice();
    return next;
  }
};
_BaseAPI.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
var BaseAPI = _BaseAPI;
function isBlob(value) {
  return typeof Blob !== "undefined" && value instanceof Blob;
}
function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}
var ResponseError = class extends Error {
  constructor(response, msg) {
    super(msg);
    this.response = response;
    this.name = "ResponseError";
  }
};
var FetchError = class extends Error {
  constructor(cause, msg) {
    super(msg);
    this.cause = cause;
    this.name = "FetchError";
  }
};
var RequiredError = class extends Error {
  constructor(field, msg) {
    super(msg);
    this.field = field;
    this.name = "RequiredError";
  }
};
var COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "	",
  pipes: "|"
};
function exists(json, key) {
  const value = json[key];
  return value !== null && value !== void 0;
}
function querystring(params, prefix = "") {
  return Object.keys(params).map((key) => querystringSingleKey(key, params[key], prefix)).filter((part) => part.length > 0).join("&");
}
function querystringSingleKey(key, value, keyPrefix = "") {
  const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
  if (value instanceof Array) {
    const multiValue = value.map((singleValue) => encodeURIComponent(String(singleValue))).join(`&${encodeURIComponent(fullKey)}=`);
    return `${encodeURIComponent(fullKey)}=${multiValue}`;
  }
  if (value instanceof Set) {
    const valueAsArray = Array.from(value);
    return querystringSingleKey(key, valueAsArray, keyPrefix);
  }
  if (value instanceof Date) {
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
  }
  if (value instanceof Object) {
    return querystring(value, fullKey);
  }
  return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}
function mapValues(data, fn) {
  return Object.keys(data).reduce(
    (acc, key) => __spreadProps(__spreadValues({}, acc), { [key]: fn(data[key]) }),
    {}
  );
}
function canConsumeForm(consumes) {
  for (const consume of consumes) {
    if ("multipart/form-data" === consume.contentType) {
      return true;
    }
  }
  return false;
}
var JSONApiResponse = class {
  constructor(raw, transformer = (jsonValue) => jsonValue) {
    this.raw = raw;
    this.transformer = transformer;
  }
  value() {
    return __async(this, null, function* () {
      return this.transformer(yield this.raw.json());
    });
  }
};
var VoidApiResponse = class {
  constructor(raw) {
    this.raw = raw;
  }
  value() {
    return __async(this, null, function* () {
      return void 0;
    });
  }
};
var BlobApiResponse = class {
  constructor(raw) {
    this.raw = raw;
  }
  value() {
    return __async(this, null, function* () {
      return yield this.raw.blob();
    });
  }
};
var TextApiResponse = class {
  constructor(raw) {
    this.raw = raw;
  }
  value() {
    return __async(this, null, function* () {
      return yield this.raw.text();
    });
  }
};

// generated/models/AccountMeta.ts
function instanceOfAccountMeta(value) {
  let isInstance = true;
  isInstance = isInstance && "pubkey" in value;
  isInstance = isInstance && "isSigner" in value;
  isInstance = isInstance && "isWritable" in value;
  return isInstance;
}
function AccountMetaFromJSON(json) {
  return AccountMetaFromJSONTyped(json, false);
}
function AccountMetaFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "pubkey": json["pubkey"],
    "isSigner": json["isSigner"],
    "isWritable": json["isWritable"]
  };
}
function AccountMetaToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "pubkey": value.pubkey,
    "isSigner": value.isSigner,
    "isWritable": value.isWritable
  };
}

// generated/models/BlockhashWithMetadata.ts
function instanceOfBlockhashWithMetadata(value) {
  let isInstance = true;
  isInstance = isInstance && "blockhash" in value;
  isInstance = isInstance && "lastValidBlockHeight" in value;
  isInstance = isInstance && "fetchedAt" in value;
  return isInstance;
}
function BlockhashWithMetadataFromJSON(json) {
  return BlockhashWithMetadataFromJSONTyped(json, false);
}
function BlockhashWithMetadataFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "blockhash": json["blockhash"],
    "lastValidBlockHeight": json["lastValidBlockHeight"],
    "fetchedAt": json["fetchedAt"]
  };
}
function BlockhashWithMetadataToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "blockhash": value.blockhash,
    "lastValidBlockHeight": value.lastValidBlockHeight,
    "fetchedAt": value.fetchedAt
  };
}

// generated/models/IndexedRouteMapResponse.ts
function instanceOfIndexedRouteMapResponse(value) {
  let isInstance = true;
  isInstance = isInstance && "mintKeys" in value;
  isInstance = isInstance && "indexedRouteMap" in value;
  return isInstance;
}
function IndexedRouteMapResponseFromJSON(json) {
  return IndexedRouteMapResponseFromJSONTyped(json, false);
}
function IndexedRouteMapResponseFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "mintKeys": json["mintKeys"],
    "indexedRouteMap": json["indexedRouteMap"]
  };
}
function IndexedRouteMapResponseToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "mintKeys": value.mintKeys,
    "indexedRouteMap": value.indexedRouteMap
  };
}

// generated/models/Instruction.ts
function instanceOfInstruction(value) {
  let isInstance = true;
  isInstance = isInstance && "programId" in value;
  isInstance = isInstance && "accounts" in value;
  isInstance = isInstance && "data" in value;
  return isInstance;
}
function InstructionFromJSON(json) {
  return InstructionFromJSONTyped(json, false);
}
function InstructionFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "programId": json["programId"],
    "accounts": json["accounts"].map(AccountMetaFromJSON),
    "data": json["data"]
  };
}
function InstructionToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "programId": value.programId,
    "accounts": value.accounts.map(AccountMetaToJSON),
    "data": value.data
  };
}

// generated/models/PlatformFee.ts
function instanceOfPlatformFee(value) {
  let isInstance = true;
  return isInstance;
}
function PlatformFeeFromJSON(json) {
  return PlatformFeeFromJSONTyped(json, false);
}
function PlatformFeeFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "amount": !exists(json, "amount") ? void 0 : json["amount"],
    "feeBps": !exists(json, "feeBps") ? void 0 : json["feeBps"]
  };
}
function PlatformFeeToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "amount": value.amount,
    "feeBps": value.feeBps
  };
}

// generated/models/SwapInfo.ts
function instanceOfSwapInfo(value) {
  let isInstance = true;
  isInstance = isInstance && "ammKey" in value;
  isInstance = isInstance && "inputMint" in value;
  isInstance = isInstance && "outputMint" in value;
  isInstance = isInstance && "inAmount" in value;
  isInstance = isInstance && "outAmount" in value;
  isInstance = isInstance && "feeAmount" in value;
  isInstance = isInstance && "feeMint" in value;
  return isInstance;
}
function SwapInfoFromJSON(json) {
  return SwapInfoFromJSONTyped(json, false);
}
function SwapInfoFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "ammKey": json["ammKey"],
    "label": !exists(json, "label") ? void 0 : json["label"],
    "inputMint": json["inputMint"],
    "outputMint": json["outputMint"],
    "inAmount": json["inAmount"],
    "outAmount": json["outAmount"],
    "feeAmount": json["feeAmount"],
    "feeMint": json["feeMint"]
  };
}
function SwapInfoToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "ammKey": value.ammKey,
    "label": value.label,
    "inputMint": value.inputMint,
    "outputMint": value.outputMint,
    "inAmount": value.inAmount,
    "outAmount": value.outAmount,
    "feeAmount": value.feeAmount,
    "feeMint": value.feeMint
  };
}

// generated/models/RoutePlanStep.ts
function instanceOfRoutePlanStep(value) {
  let isInstance = true;
  isInstance = isInstance && "swapInfo" in value;
  isInstance = isInstance && "percent" in value;
  return isInstance;
}
function RoutePlanStepFromJSON(json) {
  return RoutePlanStepFromJSONTyped(json, false);
}
function RoutePlanStepFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "swapInfo": SwapInfoFromJSON(json["swapInfo"]),
    "percent": json["percent"]
  };
}
function RoutePlanStepToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "swapInfo": SwapInfoToJSON(value.swapInfo),
    "percent": value.percent
  };
}

// generated/models/SwapMode.ts
var SwapMode = {
  ExactIn: "ExactIn",
  ExactOut: "ExactOut"
};
function SwapModeFromJSON(json) {
  return SwapModeFromJSONTyped(json, false);
}
function SwapModeFromJSONTyped(json, ignoreDiscriminator) {
  return json;
}
function SwapModeToJSON(value) {
  return value;
}

// generated/models/QuoteResponse.ts
function instanceOfQuoteResponse(value) {
  let isInstance = true;
  isInstance = isInstance && "inputMint" in value;
  isInstance = isInstance && "inAmount" in value;
  isInstance = isInstance && "outputMint" in value;
  isInstance = isInstance && "outAmount" in value;
  isInstance = isInstance && "otherAmountThreshold" in value;
  isInstance = isInstance && "swapMode" in value;
  isInstance = isInstance && "slippageBps" in value;
  isInstance = isInstance && "priceImpactPct" in value;
  isInstance = isInstance && "routePlan" in value;
  return isInstance;
}
function QuoteResponseFromJSON(json) {
  return QuoteResponseFromJSONTyped(json, false);
}
function QuoteResponseFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "inputMint": json["inputMint"],
    "inAmount": json["inAmount"],
    "outputMint": json["outputMint"],
    "outAmount": json["outAmount"],
    "otherAmountThreshold": json["otherAmountThreshold"],
    "swapMode": SwapModeFromJSON(json["swapMode"]),
    "slippageBps": json["slippageBps"],
    "platformFee": !exists(json, "platformFee") ? void 0 : PlatformFeeFromJSON(json["platformFee"]),
    "priceImpactPct": json["priceImpactPct"],
    "routePlan": json["routePlan"].map(RoutePlanStepFromJSON),
    "contextSlot": !exists(json, "contextSlot") ? void 0 : json["contextSlot"],
    "timeTaken": !exists(json, "timeTaken") ? void 0 : json["timeTaken"]
  };
}
function QuoteResponseToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "inputMint": value.inputMint,
    "inAmount": value.inAmount,
    "outputMint": value.outputMint,
    "outAmount": value.outAmount,
    "otherAmountThreshold": value.otherAmountThreshold,
    "swapMode": SwapModeToJSON(value.swapMode),
    "slippageBps": value.slippageBps,
    "platformFee": PlatformFeeToJSON(value.platformFee),
    "priceImpactPct": value.priceImpactPct,
    "routePlan": value.routePlan.map(RoutePlanStepToJSON),
    "contextSlot": value.contextSlot,
    "timeTaken": value.timeTaken
  };
}

// generated/models/SwapInstructionsResponsePrioritizationType.ts
function instanceOfSwapInstructionsResponsePrioritizationType(value) {
  let isInstance = true;
  return isInstance;
}
function SwapInstructionsResponsePrioritizationTypeFromJSON(json) {
  return SwapInstructionsResponsePrioritizationTypeFromJSONTyped(json, false);
}
function SwapInstructionsResponsePrioritizationTypeFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "jito": !exists(json, "jito") ? void 0 : json["jito"]
  };
}
function SwapInstructionsResponsePrioritizationTypeToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "jito": value.jito
  };
}

// generated/models/SwapInstructionsResponse.ts
function instanceOfSwapInstructionsResponse(value) {
  let isInstance = true;
  isInstance = isInstance && "computeBudgetInstructions" in value;
  isInstance = isInstance && "setupInstructions" in value;
  isInstance = isInstance && "swapInstruction" in value;
  isInstance = isInstance && "addressLookupTableAddresses" in value;
  isInstance = isInstance && "otherInstructions" in value;
  isInstance = isInstance && "computeUnitLimit" in value;
  isInstance = isInstance && "prioritizationType" in value;
  isInstance = isInstance && "prioritizationFeeLamports" in value;
  isInstance = isInstance && "blockhashWithMetadata" in value;
  return isInstance;
}
function SwapInstructionsResponseFromJSON(json) {
  return SwapInstructionsResponseFromJSONTyped(json, false);
}
function SwapInstructionsResponseFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "computeBudgetInstructions": json["computeBudgetInstructions"].map(InstructionFromJSON),
    "setupInstructions": json["setupInstructions"].map(InstructionFromJSON),
    "swapInstruction": InstructionFromJSON(json["swapInstruction"]),
    "cleanupInstruction": !exists(json, "cleanupInstruction") ? void 0 : InstructionFromJSON(json["cleanupInstruction"]),
    "addressLookupTableAddresses": json["addressLookupTableAddresses"],
    "otherInstructions": json["otherInstructions"].map(InstructionFromJSON),
    "computeUnitLimit": json["computeUnitLimit"],
    "prioritizationType": SwapInstructionsResponsePrioritizationTypeFromJSON(json["prioritizationType"]),
    "prioritizationFeeLamports": json["prioritizationFeeLamports"],
    "blockhashWithMetadata": BlockhashWithMetadataFromJSON(json["blockhashWithMetadata"])
  };
}
function SwapInstructionsResponseToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "computeBudgetInstructions": value.computeBudgetInstructions.map(InstructionToJSON),
    "setupInstructions": value.setupInstructions.map(InstructionToJSON),
    "swapInstruction": InstructionToJSON(value.swapInstruction),
    "cleanupInstruction": InstructionToJSON(value.cleanupInstruction),
    "addressLookupTableAddresses": value.addressLookupTableAddresses,
    "otherInstructions": value.otherInstructions.map(InstructionToJSON),
    "computeUnitLimit": value.computeUnitLimit,
    "prioritizationType": SwapInstructionsResponsePrioritizationTypeToJSON(value.prioritizationType),
    "prioritizationFeeLamports": value.prioritizationFeeLamports,
    "blockhashWithMetadata": BlockhashWithMetadataToJSON(value.blockhashWithMetadata)
  };
}

// generated/models/SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamports.ts
function instanceOfSwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamports(value) {
  let isInstance = true;
  return isInstance;
}
function SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSON(json) {
  return SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSONTyped(json, false);
}
function SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "priorityLevel": !exists(json, "priorityLevel") ? void 0 : json["priorityLevel"],
    "maxLamports": !exists(json, "maxLamports") ? void 0 : json["maxLamports"]
  };
}
function SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "priorityLevel": value.priorityLevel,
    "maxLamports": value.maxLamports
  };
}

// generated/models/SwapRequestPrioritizationFeeLamports.ts
function instanceOfSwapRequestPrioritizationFeeLamports(value) {
  let isInstance = true;
  return isInstance;
}
function SwapRequestPrioritizationFeeLamportsFromJSON(json) {
  return SwapRequestPrioritizationFeeLamportsFromJSONTyped(json, false);
}
function SwapRequestPrioritizationFeeLamportsFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "priorityLevelWithMaxLamports": !exists(json, "priorityLevelWithMaxLamports") ? void 0 : SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSON(json["priorityLevelWithMaxLamports"]),
    "jitoTipLamports": !exists(json, "jitoTipLamports") ? void 0 : json["jitoTipLamports"]
  };
}
function SwapRequestPrioritizationFeeLamportsToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "priorityLevelWithMaxLamports": SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsToJSON(value.priorityLevelWithMaxLamports),
    "jitoTipLamports": value.jitoTipLamports
  };
}

// generated/models/SwapRequest.ts
function instanceOfSwapRequest(value) {
  let isInstance = true;
  isInstance = isInstance && "userPublicKey" in value;
  isInstance = isInstance && "quoteResponse" in value;
  return isInstance;
}
function SwapRequestFromJSON(json) {
  return SwapRequestFromJSONTyped(json, false);
}
function SwapRequestFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "userPublicKey": json["userPublicKey"],
    "wrapAndUnwrapSol": !exists(json, "wrapAndUnwrapSol") ? void 0 : json["wrapAndUnwrapSol"],
    "useSharedAccounts": !exists(json, "useSharedAccounts") ? void 0 : json["useSharedAccounts"],
    "feeAccount": !exists(json, "feeAccount") ? void 0 : json["feeAccount"],
    "trackingAccount": !exists(json, "trackingAccount") ? void 0 : json["trackingAccount"],
    "prioritizationFeeLamports": !exists(json, "prioritizationFeeLamports") ? void 0 : SwapRequestPrioritizationFeeLamportsFromJSON(json["prioritizationFeeLamports"]),
    "asLegacyTransaction": !exists(json, "asLegacyTransaction") ? void 0 : json["asLegacyTransaction"],
    "destinationTokenAccount": !exists(json, "destinationTokenAccount") ? void 0 : json["destinationTokenAccount"],
    "dynamicComputeUnitLimit": !exists(json, "dynamicComputeUnitLimit") ? void 0 : json["dynamicComputeUnitLimit"],
    "skipUserAccountsRpcCalls": !exists(json, "skipUserAccountsRpcCalls") ? void 0 : json["skipUserAccountsRpcCalls"],
    "dynamicSlippage": !exists(json, "dynamicSlippage") ? void 0 : json["dynamicSlippage"],
    "computeUnitPriceMicroLamports": !exists(json, "computeUnitPriceMicroLamports") ? void 0 : json["computeUnitPriceMicroLamports"],
    "quoteResponse": QuoteResponseFromJSON(json["quoteResponse"])
  };
}
function SwapRequestToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "userPublicKey": value.userPublicKey,
    "wrapAndUnwrapSol": value.wrapAndUnwrapSol,
    "useSharedAccounts": value.useSharedAccounts,
    "feeAccount": value.feeAccount,
    "trackingAccount": value.trackingAccount,
    "prioritizationFeeLamports": SwapRequestPrioritizationFeeLamportsToJSON(value.prioritizationFeeLamports),
    "asLegacyTransaction": value.asLegacyTransaction,
    "destinationTokenAccount": value.destinationTokenAccount,
    "dynamicComputeUnitLimit": value.dynamicComputeUnitLimit,
    "skipUserAccountsRpcCalls": value.skipUserAccountsRpcCalls,
    "dynamicSlippage": value.dynamicSlippage,
    "computeUnitPriceMicroLamports": value.computeUnitPriceMicroLamports,
    "quoteResponse": QuoteResponseToJSON(value.quoteResponse)
  };
}

// generated/models/SwapResponsePrioritizationTypeComputeBudget.ts
function instanceOfSwapResponsePrioritizationTypeComputeBudget(value) {
  let isInstance = true;
  return isInstance;
}
function SwapResponsePrioritizationTypeComputeBudgetFromJSON(json) {
  return SwapResponsePrioritizationTypeComputeBudgetFromJSONTyped(json, false);
}
function SwapResponsePrioritizationTypeComputeBudgetFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "estimatedMicroLamports": !exists(json, "estimatedMicroLamports") ? void 0 : json["estimatedMicroLamports"],
    "microLamports": !exists(json, "microLamports") ? void 0 : json["microLamports"]
  };
}
function SwapResponsePrioritizationTypeComputeBudgetToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "estimatedMicroLamports": value.estimatedMicroLamports,
    "microLamports": value.microLamports
  };
}

// generated/models/SwapResponsePrioritizationTypeJito.ts
function instanceOfSwapResponsePrioritizationTypeJito(value) {
  let isInstance = true;
  return isInstance;
}
function SwapResponsePrioritizationTypeJitoFromJSON(json) {
  return SwapResponsePrioritizationTypeJitoFromJSONTyped(json, false);
}
function SwapResponsePrioritizationTypeJitoFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "lamports": !exists(json, "lamports") ? void 0 : json["lamports"]
  };
}
function SwapResponsePrioritizationTypeJitoToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "lamports": value.lamports
  };
}

// generated/models/SwapResponsePrioritizationType.ts
function instanceOfSwapResponsePrioritizationType(value) {
  let isInstance = true;
  return isInstance;
}
function SwapResponsePrioritizationTypeFromJSON(json) {
  return SwapResponsePrioritizationTypeFromJSONTyped(json, false);
}
function SwapResponsePrioritizationTypeFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "jito": !exists(json, "jito") ? void 0 : SwapResponsePrioritizationTypeJitoFromJSON(json["jito"]),
    "computeBudget": !exists(json, "computeBudget") ? void 0 : SwapResponsePrioritizationTypeComputeBudgetFromJSON(json["computeBudget"])
  };
}
function SwapResponsePrioritizationTypeToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "jito": SwapResponsePrioritizationTypeJitoToJSON(value.jito),
    "computeBudget": SwapResponsePrioritizationTypeComputeBudgetToJSON(value.computeBudget)
  };
}

// generated/models/SwapResponse.ts
function instanceOfSwapResponse(value) {
  let isInstance = true;
  isInstance = isInstance && "swapTransaction" in value;
  isInstance = isInstance && "lastValidBlockHeight" in value;
  return isInstance;
}
function SwapResponseFromJSON(json) {
  return SwapResponseFromJSONTyped(json, false);
}
function SwapResponseFromJSONTyped(json, ignoreDiscriminator) {
  if (json === void 0 || json === null) {
    return json;
  }
  return {
    "swapTransaction": json["swapTransaction"],
    "lastValidBlockHeight": json["lastValidBlockHeight"],
    "prioritizationFeeLamports": !exists(json, "prioritizationFeeLamports") ? void 0 : json["prioritizationFeeLamports"],
    "prioritizationType": !exists(json, "prioritizationType") ? void 0 : SwapResponsePrioritizationTypeFromJSON(json["prioritizationType"])
  };
}
function SwapResponseToJSON(value) {
  if (value === void 0) {
    return void 0;
  }
  if (value === null) {
    return null;
  }
  return {
    "swapTransaction": value.swapTransaction,
    "lastValidBlockHeight": value.lastValidBlockHeight,
    "prioritizationFeeLamports": value.prioritizationFeeLamports,
    "prioritizationType": SwapResponsePrioritizationTypeToJSON(value.prioritizationType)
  };
}

// generated/apis/SwapApi.ts
var SwapApi = class extends BaseAPI {
  /**
   * Returns a hash, which key is the program id and value is the label. This is used to help map error from transaction by identifying the fault program id. With that, we can use the `excludeDexes` or `dexes` parameter.
   * program-id-to-label
   */
  programIdToLabelGetRaw(initOverrides) {
    return __async(this, null, function* () {
      const queryParameters = {};
      const headerParameters = {};
      const response = yield this.request({
        path: `/program-id-to-label`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters
      }, initOverrides);
      return new JSONApiResponse(response);
    });
  }
  /**
   * Returns a hash, which key is the program id and value is the label. This is used to help map error from transaction by identifying the fault program id. With that, we can use the `excludeDexes` or `dexes` parameter.
   * program-id-to-label
   */
  programIdToLabelGet(initOverrides) {
    return __async(this, null, function* () {
      const response = yield this.programIdToLabelGetRaw(initOverrides);
      return yield response.value();
    });
  }
  /**
   * Retrieve a quote to be used in `POST /swap`.  Refer to https://station.jup.ag/docs/swap-api/get-quote for more information.
   * quote
   */
  quoteGetRaw(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      if (requestParameters.inputMint === null || requestParameters.inputMint === void 0) {
        throw new RequiredError("inputMint", "Required parameter requestParameters.inputMint was null or undefined when calling quoteGet.");
      }
      if (requestParameters.outputMint === null || requestParameters.outputMint === void 0) {
        throw new RequiredError("outputMint", "Required parameter requestParameters.outputMint was null or undefined when calling quoteGet.");
      }
      if (requestParameters.amount === null || requestParameters.amount === void 0) {
        throw new RequiredError("amount", "Required parameter requestParameters.amount was null or undefined when calling quoteGet.");
      }
      const queryParameters = {};
      if (requestParameters.inputMint !== void 0) {
        queryParameters["inputMint"] = requestParameters.inputMint;
      }
      if (requestParameters.outputMint !== void 0) {
        queryParameters["outputMint"] = requestParameters.outputMint;
      }
      if (requestParameters.amount !== void 0) {
        queryParameters["amount"] = requestParameters.amount;
      }
      if (requestParameters.slippageBps !== void 0) {
        queryParameters["slippageBps"] = requestParameters.slippageBps;
      }
      if (requestParameters.swapMode !== void 0) {
        queryParameters["swapMode"] = requestParameters.swapMode;
      }
      if (requestParameters.dexes) {
        queryParameters["dexes"] = requestParameters.dexes;
      }
      if (requestParameters.excludeDexes) {
        queryParameters["excludeDexes"] = requestParameters.excludeDexes;
      }
      if (requestParameters.restrictIntermediateTokens !== void 0) {
        queryParameters["restrictIntermediateTokens"] = requestParameters.restrictIntermediateTokens;
      }
      if (requestParameters.onlyDirectRoutes !== void 0) {
        queryParameters["onlyDirectRoutes"] = requestParameters.onlyDirectRoutes;
      }
      if (requestParameters.asLegacyTransaction !== void 0) {
        queryParameters["asLegacyTransaction"] = requestParameters.asLegacyTransaction;
      }
      if (requestParameters.platformFeeBps !== void 0) {
        queryParameters["platformFeeBps"] = requestParameters.platformFeeBps;
      }
      if (requestParameters.maxAccounts !== void 0) {
        queryParameters["maxAccounts"] = requestParameters.maxAccounts;
      }
      const headerParameters = {};
      const response = yield this.request({
        path: `/quote`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => QuoteResponseFromJSON(jsonValue));
    });
  }
  /**
   * Retrieve a quote to be used in `POST /swap`.  Refer to https://station.jup.ag/docs/swap-api/get-quote for more information.
   * quote
   */
  quoteGet(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      const response = yield this.quoteGetRaw(requestParameters, initOverrides);
      return yield response.value();
    });
  }
  /**
   * Returns instructions that you can use from the quote you get from `/quote`.  Refer to https://station.jup.ag/docs/swap-api/build-swap-transaction#build-your-own-transaction-with-instructions for more information.
   * swap-instructions
   */
  swapInstructionsPostRaw(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      if (requestParameters.swapRequest === null || requestParameters.swapRequest === void 0) {
        throw new RequiredError("swapRequest", "Required parameter requestParameters.swapRequest was null or undefined when calling swapInstructionsPost.");
      }
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = yield this.request({
        path: `/swap-instructions`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: SwapRequestToJSON(requestParameters.swapRequest)
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => SwapInstructionsResponseFromJSON(jsonValue));
    });
  }
  /**
   * Returns instructions that you can use from the quote you get from `/quote`.  Refer to https://station.jup.ag/docs/swap-api/build-swap-transaction#build-your-own-transaction-with-instructions for more information.
   * swap-instructions
   */
  swapInstructionsPost(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      const response = yield this.swapInstructionsPostRaw(requestParameters, initOverrides);
      return yield response.value();
    });
  }
  /**
   * Returns a transaction that you can use from the quote you get from `/quote`.  Refer to https://station.jup.ag/docs/swap-api/build-swap-transaction for more information.
   * swap
   */
  swapPostRaw(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      if (requestParameters.swapRequest === null || requestParameters.swapRequest === void 0) {
        throw new RequiredError("swapRequest", "Required parameter requestParameters.swapRequest was null or undefined when calling swapPost.");
      }
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = yield this.request({
        path: `/swap`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: SwapRequestToJSON(requestParameters.swapRequest)
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => SwapResponseFromJSON(jsonValue));
    });
  }
  /**
   * Returns a transaction that you can use from the quote you get from `/quote`.  Refer to https://station.jup.ag/docs/swap-api/build-swap-transaction for more information.
   * swap
   */
  swapPost(requestParameters, initOverrides) {
    return __async(this, null, function* () {
      const response = yield this.swapPostRaw(requestParameters, initOverrides);
      return yield response.value();
    });
  }
};

// src/index.ts
var createJupiterApiClient = (config) => {
  return new SwapApi(new Configuration(config));
};
export {
  AccountMetaFromJSON,
  AccountMetaFromJSONTyped,
  AccountMetaToJSON,
  BASE_PATH,
  BaseAPI,
  BlobApiResponse,
  BlockhashWithMetadataFromJSON,
  BlockhashWithMetadataFromJSONTyped,
  BlockhashWithMetadataToJSON,
  COLLECTION_FORMATS,
  Configuration,
  DefaultConfig,
  FetchError,
  IndexedRouteMapResponseFromJSON,
  IndexedRouteMapResponseFromJSONTyped,
  IndexedRouteMapResponseToJSON,
  InstructionFromJSON,
  InstructionFromJSONTyped,
  InstructionToJSON,
  JSONApiResponse,
  PlatformFeeFromJSON,
  PlatformFeeFromJSONTyped,
  PlatformFeeToJSON,
  QuoteResponseFromJSON,
  QuoteResponseFromJSONTyped,
  QuoteResponseToJSON,
  RequiredError,
  ResponseError,
  RoutePlanStepFromJSON,
  RoutePlanStepFromJSONTyped,
  RoutePlanStepToJSON,
  SwapApi,
  SwapInfoFromJSON,
  SwapInfoFromJSONTyped,
  SwapInfoToJSON,
  SwapInstructionsResponseFromJSON,
  SwapInstructionsResponseFromJSONTyped,
  SwapInstructionsResponsePrioritizationTypeFromJSON,
  SwapInstructionsResponsePrioritizationTypeFromJSONTyped,
  SwapInstructionsResponsePrioritizationTypeToJSON,
  SwapInstructionsResponseToJSON,
  SwapMode,
  SwapModeFromJSON,
  SwapModeFromJSONTyped,
  SwapModeToJSON,
  SwapRequestFromJSON,
  SwapRequestFromJSONTyped,
  SwapRequestPrioritizationFeeLamportsFromJSON,
  SwapRequestPrioritizationFeeLamportsFromJSONTyped,
  SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSON,
  SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsFromJSONTyped,
  SwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamportsToJSON,
  SwapRequestPrioritizationFeeLamportsToJSON,
  SwapRequestToJSON,
  SwapResponseFromJSON,
  SwapResponseFromJSONTyped,
  SwapResponsePrioritizationTypeComputeBudgetFromJSON,
  SwapResponsePrioritizationTypeComputeBudgetFromJSONTyped,
  SwapResponsePrioritizationTypeComputeBudgetToJSON,
  SwapResponsePrioritizationTypeFromJSON,
  SwapResponsePrioritizationTypeFromJSONTyped,
  SwapResponsePrioritizationTypeJitoFromJSON,
  SwapResponsePrioritizationTypeJitoFromJSONTyped,
  SwapResponsePrioritizationTypeJitoToJSON,
  SwapResponsePrioritizationTypeToJSON,
  SwapResponseToJSON,
  TextApiResponse,
  VoidApiResponse,
  canConsumeForm,
  createJupiterApiClient,
  exists,
  instanceOfAccountMeta,
  instanceOfBlockhashWithMetadata,
  instanceOfIndexedRouteMapResponse,
  instanceOfInstruction,
  instanceOfPlatformFee,
  instanceOfQuoteResponse,
  instanceOfRoutePlanStep,
  instanceOfSwapInfo,
  instanceOfSwapInstructionsResponse,
  instanceOfSwapInstructionsResponsePrioritizationType,
  instanceOfSwapRequest,
  instanceOfSwapRequestPrioritizationFeeLamports,
  instanceOfSwapRequestPrioritizationFeeLamportsPriorityLevelWithMaxLamports,
  instanceOfSwapResponse,
  instanceOfSwapResponsePrioritizationType,
  instanceOfSwapResponsePrioritizationTypeComputeBudget,
  instanceOfSwapResponsePrioritizationTypeJito,
  mapValues,
  querystring
};
