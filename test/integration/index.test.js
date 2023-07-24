'use strict';

const assert = require('node:assert');
const requireAll = require('../..');

describe('requireAll(directoryPath)', () => {
	let returnValue;

	beforeEach(() => {
		returnValue = requireAll(`${__dirname}/fixture/main`);
	});

	it('returns the expected modules', () => {
		assert.deepStrictEqual(returnValue, [
			{
				name: 'file-one',
				fullPath: `${__dirname}/fixture/main/file-one.js`,
				extension: '.js',
				moduleExports: {isFileOne: true}
			},
			{
				name: 'full-directory/file-two',
				fullPath: `${__dirname}/fixture/main/full-directory/file-two.js`,
				extension: '.js',
				moduleExports: {isFileTwo: true}
			},
			{
				name: 'full-directory/sub-directory/file-four',
				fullPath: `${__dirname}/fixture/main/full-directory/sub-directory/file-four.json`,
				extension: '.json',
				moduleExports: {isFileFour: true}
			},
			{
				name: 'full-directory/sub-directory/file-three',
				fullPath: `${__dirname}/fixture/main/full-directory/sub-directory/file-three.js`,
				extension: '.js',
				moduleExports: {isFileThree: true}
			}
		]);
	});
});
