/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: keyof Omit<Body, "body" | "bodyUsed">;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType) => RequestParams | void;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://localhost:3000/api";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;
  private abortControllers = new Map<CancelToken, AbortController>();

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format = "json",
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = (secure && this.securityWorker && this.securityWorker(this.securityData)) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API Documentation Asset Tracker
 * @version 1.0.0
 * @baseUrl https://localhost:3000/api
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Sign in
     *
     * @tags auth
     * @name AuthCreate
     * @request POST:/auth
     */
    authCreate: (body: { email?: string; password?: string }, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  warehouse = {
    /**
     * @description List all warehouse
     *
     * @tags warehouse
     * @name WarehouseList
     * @request GET:/warehouse
     */
    warehouseList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/warehouse`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Create a warehouse
     *
     * @tags warehouse
     * @name WarehouseCreate
     * @request POST:/warehouse
     */
    warehouseCreate: (
      body: { name?: string; description?: string; latitude?: string; longitude?: string },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/warehouse`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get warehouse detail
     *
     * @tags warehouse
     * @name WarehouseDetail
     * @request GET:/warehouse/{id}
     */
    warehouseDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/warehouse/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Get all users in warehouse
     *
     * @tags warehouse
     * @name UsersDetail
     * @request GET:/warehouse/{id}/users
     */
    usersDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/warehouse/${id}/users`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Create a user warehouse
     *
     * @tags warehouse
     * @name UsersCreate
     * @request POST:/warehouse/{id}/users
     */
    usersCreate: (
      id: string,
      body: { fullname?: string; email?: string; password?: string; phoneNo?: string },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/warehouse/${id}/users`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  assets = {
    /**
     * No description
     *
     * @tags asset
     * @name AssetsList
     * @request GET:/assets
     */
    assetsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assets`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name AssetsCreate
     * @request POST:/assets
     */
    assetsCreate: (
      body: { serialNumber?: string; manufacturer?: string; metadata?: object },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/assets`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name AssetsDetail
     * @request GET:/assets/{id}
     */
    assetsDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assets/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name RecordCreate
     * @request POST:/assets/{id}/record
     */
    recordCreate: (id: string, body: { metadata?: object }, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/assets/${id}/record`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
}
