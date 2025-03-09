'use strict';

const { listAllFilesSync } = require('@rowanmanning/list-all-files');
const path = require('node:path');

/**
 * @import { ModuleInfo, Options, requireAll } from '.'
 * @import { ParsedPath } from 'node:path'
 */

/** @type {Required<Options>} */
const defaultOptions = {
	extensions: ['.js', '.json']
};

/** @type {requireAll} */
exports.requireAll = function requireAll(directoryPath, options) {
	const defaultedOptions = Object.assign({}, defaultOptions, options);
	return listAllFilesSync(directoryPath)
		.map((filePath) => path.parse(filePath))
		.filter((file) => defaultedOptions.extensions.includes(file.ext.toLowerCase()))
		.map(requireModule.bind(null, directoryPath));
};

/**
 * @param {string} baseDirectoryPath
 * @param {ParsedPath} file
 * @returns {ModuleInfo}
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
