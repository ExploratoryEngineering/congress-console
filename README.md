# Frontend

## Prerequesites
- NPM >= 5
- Node >= 8

## Installation of dependencies

Run `npm i`

## Development

Run `npm start`

This will start a web server on https://localhost:8080. Accept the untrusted certificate, well, because it's unsigned and for localhost.

## Test

Run all tests
```bash
npm t
```

Running this command will run all the tests below

### Unit/Jest

```bash
npm run test:jest
```

This will run tests found in the project and create a coverage report in `test/coverage-jest` which can be opened locally in your favorite browser.

### Built app

```bash
npm run test:build
```

This will test the bundlesize as well as e2e of the production built app.

### Linting

```bash
npm run test:lint
```

Will run all linting below

#### Linting of JavaScript
```bash
npm run test:eslint
```

#### Linting of TypeScript
```bash
npm run test:tslint
```

### Testing deps for vulnerabilities
```bash
npm run test:retire
``` 

## Build

Run `npm run build`

This will build an optimized build for production purposes and output to the `dist` folder.

## Deployment

To deploy run
```bash
npm run deploy:{yourFavoriteEnvironment}
```

This will trigger a full test of the project along with the corresponding deploy script. You'll need the correct credentials to be able to use the scripts. The scripts uploads to an AWS S3-bucket and refreshes the AWS CloudFront distribution upon successful upload.
