import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { HttpResponseMessage } from 'aurelia-http-client';
import { Promise } from 'bluebird';

const Log = LogBuilder.create('Response handler');

class ResponseError {
  content: any;

  constructor(content: any) {
    this.content = content;
  }
}

class BadRequestError extends ResponseError {
  errorCode: 400;

  constructor(content: any) {
    super(content);
  }
}

class UnauthorizedError extends ResponseError {
  errorCode: 401;

  constructor(content: any) {
    super(content);
  }
}

class NotFoundError extends ResponseError {
  errorCode: 404;

  constructor(content: any) {
    super(content);
  }
}

class ServerErrorError extends ResponseError {
  errorCode: 500;
  constructor(content: any) {
    super(content);
  }
}

class BadGatewayError extends ResponseError {
  errorCode: 502;
  constructor(content: any) {
    super(content);
  }
}

class ServiceUnavailableError extends ResponseError {
  errorCode: 503;
  constructor(content: any) {
    super(content);
  }
}

class UnknownError extends ResponseError {
  errorCode: 0;
  constructor(content: any) {
    super(content);
  }
}

/**
 * Simple response handler class which converts to known models and acts on 401/500/502/503
 */
@autoinject
export class ResponseHandler {
  constructor(private router: Router) { }

  handleResponse(response: HttpResponseMessage) {
    if (response.isSuccess) {
      return;
    }

    switch (response.statusCode) {
      case 0: {
        this.navigateToServerError();
        throw new UnknownError(response.content);
      }
      case 400: {
        throw new BadRequestError(response.content);
      }
      case 401: {
        this.navigateToLogin();
        throw new UnauthorizedError(response.content);
      }
      case 404: {
        Log.debug('returning on 404');
        throw new NotFoundError(response.content);
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
    }
  }

  private navigateToLogin() {
    Log.debug('Redirecting to login due to 401');
    this.router.navigate('login');
  }

  private navigateToServerError() {
    Log.debug('Redirecting to server-error page');
    this.router.navigate('server-error');
  }
}
