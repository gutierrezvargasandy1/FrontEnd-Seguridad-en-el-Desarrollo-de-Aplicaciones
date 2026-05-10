export interface ErrorResponse {
  userMessage: string;
  fieldErrors?: { [key: string]: string };
}