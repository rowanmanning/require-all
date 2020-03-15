/**
 * @rowanmanning/require-all module
 * @module @rowanmanning/require-all
 */
'use strict';

const listAllFiles = require('@rowanmanning/list-all-files').sync;
const path = require('path');

/**
 * Require all modules in a directory recursively.
 *
 * @access public
 * @param {String} directoryPath
 *     The directory path to look for files in.
 * @param {Object} [options={}]
 *     An options object used to configure the require.
 * @param {Array<String>} [options.extensions=['.js', '.json']]
 *     The file extensions to require.
 * @returns {Array<ModuleInfo>}
 *     Returns an array of modules.
 */
function requireAll(directoryPath, options) {
	options = Object.assign({}, requireAll.defaultOptions, options);
	return listAllFiles(directoryPath)
		.map(filePath => path.parse(filePath))
		.filter(file => options.extensions.includes(file.ext.toLowerCase()))
		.map(requireModule.bind(null, directoryPath));
}

/**
 * Require a module.
 *
 * @access private
 * @param {String} baseDirectoryPath
 *     The base directory path that was used to find files.
 * @param {Object} file
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
 * @typedef {Object} ModuleInfo
 * @property {String} name
 *     The module name, which is the module path relative to the given `directoryPath`
 *     and without a file extension.
 * @property {String} fullPath
 *     The full path to the module.
 * @property {String} extension
 *     The module file extension, including the leading period.
 * @property {*} moduleExports
 *     The value of the module's `exports` property.
 */

/**
 * Default options to be used in a require.
 *
 * @access private
 * @type {Object}
 */
requireAll.defaultOptions = {
	extensions: [
		'.js',
		'.json'
	]
};

module.exports = requireAll;
