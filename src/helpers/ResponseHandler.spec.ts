import { EventAggregatorMock, RouterMock } from "Test/mock/mocks";
import { BadRequestError, Conflict, NotFoundError, ResponseError, ResponseHandler } from "./ResponseHandler";

describe("Response handler", () => {
  let routerStub;
  let eventAggregatorStub;

  let responseHandler: ResponseHandler;

  beforeAll(() => {
    routerStub = new RouterMock();
    eventAggregatorStub = new EventAggregatorMock();

    responseHandler = new ResponseHandler(routerStub, eventAggregatorStub);
  });

  describe("default response handlers", () => {
    it("should correctly throw Bad Request on 400", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 400,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Bad request");
    });

    it("should correctly throw Unauthorized on 401", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 401,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Unauthorized");
    });

    it("should correctly throw Forbidden on 403", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 403,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Forbidden");
    });

    it("should correctly throw Not found on 404", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 404,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Not found");
    });

    it("should correctly throw Not supported on 405", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 405,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Not supported");
    });

    it("should correctly throw Conflict on 409", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 409,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Conflict");
    });

    it("should correctly throw Server error on 500", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 500,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Server error");
    });

    it("should correctly throw Bad gateway on 502", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 502,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Bad gateway");
    });

    it("should correctly throw Service unavailable on 503", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 503,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Service unavailable");
    });

    it("should correctly throw a Uknown error on unknown code", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 0,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Unknown error");
    });
  });

  describe("special actions upon response", () => {
    it("should navigate to login upon 401", () => {
      const redirectLoginSpy = spyOn(routerStub, "navigate");

      const customResponse = {
        isSuccess: false,
        statusCode: 401,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Unauthorized");
      expect(redirectLoginSpy).toHaveBeenCalledWith("login");
    });

    it("should navigate to server error upon 500", () => {
      const redirectLoginSpy = spyOn(routerStub, "navigate");

      const customResponse = {
        isSuccess: false,
        statusCode: 500,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Server error");
      expect(redirectLoginSpy).toHaveBeenCalledWith("server-error");
    });

    it("should navigate to server error upon 502", () => {
      const redirectLoginSpy = spyOn(routerStub, "navigate");

      const customResponse = {
        isSuccess: false,
        statusCode: 502,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Bad gateway");
      expect(redirectLoginSpy).toHaveBeenCalledWith("server-error");
    });

    it("should navigate to server error upon 503", () => {
      const redirectLoginSpy = spyOn(routerStub, "navigate");

      const customResponse = {
        isSuccess: false,
        statusCode: 503,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Service unavailable");
      expect(redirectLoginSpy).toHaveBeenCalledWith("server-error");
    });

    it("should navigate to server error upon unknown error", () => {
      const redirectLoginSpy = spyOn(routerStub, "navigate");

      const customResponse = {
        isSuccess: false,
        statusCode: 0,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Unknown error");
      expect(redirectLoginSpy).toHaveBeenCalledWith("server-error");
    });

    it("should publish message upon 405", () => {
      const publishSpy = spyOn(eventAggregatorStub, "publish");

      const customResponse = {
        isSuccess: false,
        statusCode: 405,
        content: "",
      };

      expect(
        () => responseHandler.handleResponse(customResponse),
      ).toThrow("Not supported");
      expect(publishSpy).toHaveBeenCalled();
    });
  });

  describe("instanciation", () => {
    it("should correctly throw instance of Error", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 400,
        content: "",
      };
      try {
        responseHandler.handleResponse(customResponse);
      } catch (e) {
        expect(e instanceof Error).toBe(true);
      }
    });

    it("should correctly throw instance of ResponseError", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 400,
        content: "",
      };
      try {
        responseHandler.handleResponse(customResponse);
      } catch (e) {
        expect(e instanceof ResponseError).toBe(true);
      }
    });

    it("should correctly throw instance of NotFoundError", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 404,
        content: "",
      };
      try {
        responseHandler.handleResponse(customResponse);
      } catch (e) {
        expect(e instanceof NotFoundError).toBe(true);
      }
    });

    it("should correctly throw instance of Conflict", () => {
      const customResponse = {
        isSuccess: false,
        statusCode: 409,
        content: "",
      };
      try {
        responseHandler.handleResponse(customResponse);
      } catch (e) {
        expect(e instanceof Conflict).toBe(true);
      }
    });
  });
});
