import { AppError } from "./app.error.js";

export class UserFacingError extends AppError {
  readonly userMessage: string;

  constructor(userMessage: string, code = "USER_FACING_ERROR") {
    super(userMessage, code);
    this.name = "UserFacingError";
    this.userMessage = userMessage;
  }
}
