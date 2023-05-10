import { Http } from "@mui/icons-material";
const InternalServerError: number = 500;
const StatusBadRequest: number = 400;
const StatusUnauthorized: number = 401;
const StatusForbidden: number = 403;
const StatusConflict: number = 409;

interface CustomError {
  error?: string;
  message?: string;
  code?: number;
}
var UknownError: CustomError = {
  error: "Unknown Error",
  message: "You have encountred an Unknown error",
  code: InternalServerError,
};
var ValidationError: CustomError = {
  error: "Validation Error",
  message: "Please review and fix validation errors",
  code: StatusBadRequest,
};
var UnauthorizedError: CustomError = {
  error: "Unauthorized Error",
  message: "You are not authorized to request this resource",
  code: StatusUnauthorized,
};
var ForbidenError: CustomError = {
  error: "Forbiden Error",
  message: "Authorization failed, check your credentials",
  code: StatusForbidden,
};
