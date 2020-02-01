# Savour Button API



### Installation

Install the Node.js packages 

``` bash
$ npm install
```

### Usage

Deploy project

``` bash
$ serverless deploy
```

Deploy a single function

``` bash
$ serverless deploy function --function <function name>
```

#### Running Tests

Run tests using

``` bash
$ npm test
```

Run a single test

``` bash
$ serverless invoke local --function <function name> --path <api name>/mocks/<file name>.json
```

Use Jest to run our tests. You can read more about setting up tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).

#### Environment Variables

To add environment variables to the project

1. Rename `env.example` to `.env`.
2. Add environment variables for your local stage to `.env`.
3. Uncomment `environment:` block in the `serverless.yml` and reference the environment variable as `${env:MY_ENV_VAR}`. Where `MY_ENV_VAR` is added to your `.env` file.
4. Make sure to not commit your `.env`.

#### Linting

We use [ESLint](https://eslint.org) to lint code via the [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle) plugin.

Turn this off by adding the following to `serverless.yml`.

``` yaml
custom:
  bundle:
    linting: false
```