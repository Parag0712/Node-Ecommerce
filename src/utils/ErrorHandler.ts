class ErrorHandler extends Error {
    public code?: number;
    public keyPattern?: {
        email:number
    };
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;