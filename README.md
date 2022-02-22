
# @rowanmanning/require-all

Require all modules in a directory recursively.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 14+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/require-all
```

Load the library into your code with a `require` call:

```js
const requireAll = require('@rowanmanning/require-all');
```

Require all modules in a directory. **Note:** this loads modules synchronously, so it's best used only where blocking doesn't matter, e.g. in your application's startup process:

```js
const modules = requireAll('./directory-path');
```

`modules` is an array of objects, each being information about the module:

```js
{
    // The name of the file, this is relative to the given directory path
    // and does not include the file extension or a leading slash.
    name: String,

    // The full path to the module.
    fullPath: String,

    // The module file extension, including the leading period, and lower-cased
    extension: String,

    // The required module's exports
    moduleExports: Object
}
```


## Contributing

To contribute to this library, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code, and run the linter before opening a pull-request:

```sh
npm run test    # run all tests
npm run verify  # run all linters
```


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2020, Rowan Manning
