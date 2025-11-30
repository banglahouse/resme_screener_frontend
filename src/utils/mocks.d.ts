type RequestOptions = RequestInit & {
    useMock?: boolean;
};
export declare function mockRequest<T>(path: string, options: RequestOptions): Promise<T>;
export {};
