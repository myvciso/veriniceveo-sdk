export class VeoError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "VeoError";
    this.status = status;
    this.body = body;
  }
}

export class VeoAuthError extends VeoError {
  constructor(message: string, status: number, body?: unknown) {
    super(message, status, body);
    this.name = "VeoAuthError";
  }
}

export class VeoApiError extends VeoError {
  constructor(message: string, status: number, body?: unknown) {
    super(message, status, body);
    this.name = "VeoApiError";
  }
}
