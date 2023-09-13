class BaseError extends Error {
  #code = 500;
  constructor() {
    super();
    this.message = "Unable to perform task";
    this.name = "UnableToPerform";
    this.code = this.#code;
  }
}
export { BaseError };
