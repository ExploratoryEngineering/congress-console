/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Response handler");

interface ResponseHandlerObject {
  isSuccess: boolean;
  statusCode: number;
  content: any;
}

export class ResponseError {
  content: any;
  message: string = "Generic response error";
  stack: string;
  name: string;

  constructor(content: any) {
    this.stack = (new Error()).stack;
    this.content = content;
    this.name = this.constructor.name;
  }
}
ResponseError.prototype = Object.create(Error.prototype);

export class BadRequestError extends ResponseError {
  errorCode = 400;
  message = "Bad request";

  constructor(content: any) {
    super(content);
  }
}

class UnauthorizedError extends ResponseError {
  errorCode = 401;
  message = "Unauthorized";

  constructor(content: any) {
    super(content);
  }
}

class ForbiddenError extends ResponseError {
  errorCode = 403;
  message = "Forbidden";

  constructor(content: any) {
    super(content);
  }
}

export class NotFoundError extends ResponseError {
  errorCode = 404;
  message = "Not found";

  constructor(content: any) {
    super(content);
  }
}

class MethodNotSupported extends ResponseError {
  errorCode = 405;
  message = "Not supported";

  constructor(content: any) {
    super(content);
  }
}

export class Conflict extends ResponseError {
  errorCode = 409;
  message = "Conflict";

  constructor(content: any) {
    super(content);
  }
}

class ServerErrorError extends ResponseError {
  errorCode = 500;
  message = "Server error";

  constructor(content: any) {
    super(content);
  }
}

class BadGatewayError extends ResponseError {
  errorCode = 502;
  message = "Bad gateway";

  constructor(content: any) {
    super(content);
  }
}

class ServiceUnavailableError extends ResponseError {
  errorCode = 503;
  message = "Service unavailable";

  constructor(content: any) {
    super(content);
  }
}

class UnknownError extends ResponseError {
  errorCode = 0;
  message = "Unknown error";

  constructor(content: any) {
    super(content);
  }
}

/**
 * Simple response handler class which converts to known models and acts on 401/500/502/503
 */
@autoinject
export class ResponseHandler {
  constructor(
    private router: Router,
    private eventAggregator: EventAggregator,
  ) { }

  handleResponse(response: ResponseHandlerObject) {
    if (response.isSuccess) {
      return;
    }

    switch (response.statusCode) {
      case 400: {
        throw new BadRequestError(response.content);
      }
      case 401: {
        this.navigateToLogin();
        throw new UnauthorizedError(response.content);
      }
      case 403: {
        throw new ForbiddenError(response.content);
      }
      case 404: {
        Log.debug("returning on 404");
        throw new NotFoundError(response.content);
      }
      case 405: {
        this.eventAggregator.publish("global:message", { body: "Feature not implemented... yet!" });
        throw new MethodNotSupported(response.content);
      }
      case 409: {
        Log.debug("returning on 409");
        throw new Conflict(response.content);
      }
      case 500: {
        this.navigateToServerError();
        throw new ServerErrorError(response.content);
      }
      case 502: {
        this.navigateToServerError();
        throw new BadGatewayError(response.content);
      }
      case 503: {
        this.navigateToServerError();
        throw new ServiceUnavailableError(response.content);
      }
      default: {
        this.navigateToServerError();
        throw new UnknownError(response.content);
      }
    }
  }

  private navigateToLogin() {
    Log.debug("Redirecting to login due to 401");
    this.router.navigate("login");
  }

  private navigateToServerError() {
    Log.debug("Redirecting to server-error page");
    this.router.navigate("server-error");
  }
}
