export class FadrAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'FadrAPIError';
  }
}

export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessingError';
  }
}