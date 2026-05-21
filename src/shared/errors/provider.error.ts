import { AppError } from "./app.error.js";

export class ProviderError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, "PROVIDER_ERROR", options);
    this.name = "ProviderError";
  }
}
