export class AppError extends Error {
  readonly code: string;

  constructor(message: string, code = "APP_ERROR", options?: { cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}
