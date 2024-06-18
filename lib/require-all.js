'use strict';

const listAllFiles = require('@rowanmanning/list-all-files').sync;
const path = require('node:path');

/**
 * Require all modules in a directory recursively.
 *
 * @public
 * @param {string} directoryPath
 *     The directory path to look for files in.
 * @param {object} [options]
 *     An options object used to configure the require.
 * @param {string[]} [options.extensions]
 *     The file extensions to require.
 * @returns {ModuleInfo[]}
 *     Returns an array of modules.
 */
function requireAll(directoryPath, options) {
	const defaultedOptions = Object.assign({}, requireAll.defaultOptions, options);
	return listAllFiles(directoryPath)
		.map((filePath) => path.parse(filePath))
		.filter((file) => defaultedOptions?.extensions?.includes(file.ext.toLowerCase()))
		.map(requireModule.bind(null, directoryPath));
}

/**
 * Require a module.
 *
 * @private
 * @param {string} baseDirectoryPath
 *     The base directory path that was used to find files.
 * @param {object} file
 *     A file object.
 * @returns {ModuleInfo}
 *     Returns module information.
 */
function requireModule(baseDirectoryPath, file) {
	const fullPath = path.format(file);
	const fullPathWithoutExtension = path.join(file.dir, file.name);
	const name = path.relative(baseDirectoryPath, fullPathWithoutExtension);
	return {
		name,
		fullPath,
		extension: file.ext.toLowerCase(),
		moduleExports: require(fullPath)
	};
}

/**
 * @typedef {object} ModuleInfo
 * @property {string} name
 *     The module name, which is the module path relative to the given `directoryPath`
 *     and without a file extension.
 * @property {string} fullPath
 *     The full path to the module.
 * @property {string} extension
 *     The module file extension, including the leading period.
 * @property {any} moduleExports
 *     The value of the module's `exports` property.
 */

/**
 * Default options to be used in a require.
 *
 * @private
 * @type {object}
 */
requireAll.defaultOptions = {
	extensions: ['.js', '.json']
};

module.exports = requireAll;
module.exports.default = module.exports;
