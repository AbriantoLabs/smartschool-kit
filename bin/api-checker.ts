import { SmartschoolClient } from "../src/mod.ts";
import endpoints from "../src/endpoints.json" with { type: "json" };
import config from "../config.json" with { type: "json" };

export class APIChecker {
  private client: SmartschoolClient;
  private endpoints: Record<string, unknown>;

  constructor(client: SmartschoolClient) {
    this.client = client;
    this.endpoints = endpoints;
  }

  /**
   * Check if a specific method is available in the API
   * @param methodName - The name of the method to check
   * @returns An object containing availability information
   */
  checkMethod(methodName: string) {
    const isInEndpoints = methodName in this.endpoints;
    const isInClient =
      methodName in this.client &&
      typeof this.client[methodName] === "function";

    return {
      available: isInEndpoints && isInClient,
      inEndpoints: isInEndpoints,
      inClient: isInClient,
      status: this.getMethodStatus(isInEndpoints, isInClient),
    };
  }

  /**
   * Get a list of all methods and their availability
   * @returns An array of method availability information
   */
  private readonly PRIVATE_METHODS = ["constructor", "makeRequest"];

  getAllMethodsStatus() {
    const allMethods = new Set([
      ...Object.keys(this.endpoints),
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.client)).filter(
        (prop) => !this.PRIVATE_METHODS.includes(prop),
      ),
    ]);

    return Array.from(allMethods).map((method) => ({
      method,
      ...this.checkMethod(method),
    }));
  }

  /**
   * Get methods that are in endpoints but not implemented in client
   * @returns Array of missing method names
   */
  getMissingMethods() {
    return Object.keys(this.endpoints).filter(
      (method) => !this.checkMethod(method).inClient,
    );
  }

  /**
   * Get methods that are in client but not in endpoints
   * @returns Array of extra method names
   */
  getExtraMethods() {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this.client))
      .filter((prop) => !this.PRIVATE_METHODS.includes(prop))
      .filter((method) => !this.checkMethod(method).inEndpoints);
  }

  private getMethodStatus(inEndpoints: boolean, inClient: boolean): string {
    if (inEndpoints && inClient) return "Fully available";
    if (inEndpoints) return "Defined in endpoints but not implemented";
    if (inClient) return "Implemented but not in endpoints";
    return "Not available";
  }
}

// Usage example:
const client = new SmartschoolClient(config);
export const checker = new APIChecker(client);

// Check a specific method
console.log(checker.checkMethod("getMessages"));

// Get all methods status
console.log(checker.getAllMethodsStatus());

// Get missing methods
console.log(checker.getMissingMethods());

// Get extra methods
console.log(checker.getExtraMethods());
