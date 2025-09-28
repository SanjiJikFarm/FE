// utils.js
// error format
export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const toHttpError = (e) => {
  const status = e.response?.status;
  const reason = e.response?.data?.reason;
  const fallbackMessage = e.message ?? 'Unknown error has occurred.';

  const message =
    status && reason ? `${status}: ${reason}` : status ? `${status}: ${fallbackMessage}` : fallbackMessage;

  return new HttpError(message, status);
};
