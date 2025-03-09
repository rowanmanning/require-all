'use strict';

const { afterEach, beforeEach, describe, it } = require('node:test');
const assert = require('node:assert');
const td = require('testdouble');

td.config({ ignoreWarnings: true });

describe('require-all', () => {
	let listAllFiles;
	let mockFiles;
	let requireAll;

	beforeEach(() => {
		listAllFiles = td.replace('@rowanmanning/list-all-files');

		mockFiles = {
			fileA: 'mock-file-a',
			fileB: 'mock-file-b',
			fileC: 'mock-file-c',
			fileD: 'mock-file-d',
			fileE: 'mock-file-e'
		};
		td.replace('/mock-dir/a.js', mockFiles.fileA);
		td.replace('/mock-dir/mock-subdir-1/b.JS', mockFiles.fileB);
		td.replace('/mock-dir/mock-subdir-1/mock-subdir-2/c.json', mockFiles.fileC);
		td.replace('/mock-dir/d.ts', mockFiles.fileD);

		td.when(listAllFiles.sync('/mock-dir')).thenReturn([
			'/mock-dir/a.js',
			'/mock-dir/mock-subdir-1/b.JS',
			'/mock-dir/mock-subdir-1/mock-subdir-2/c.json',
			'/mock-dir/d.ts',
			'/mock-dir/e.txt'
		]);

		requireAll = require('../..');
	});

	afterEach(() => td.reset());

	it('exports a function', () => {
		assert.strictEqual(typeof requireAll, 'function');
	});

	describe('requireAll(directoryPath)', () => {
		let returnValue;

		beforeEach(() => {
			returnValue = requireAll('/mock-dir');
		});

		it('returns an array of module info objects, ignoring non JS and JSON files', () => {
			assert.ok(Array.isArray(returnValue));
			assert.deepStrictEqual(returnValue, [
				{
					name: 'a',
					fullPath: '/mock-dir/a.js',
					extension: '.js',
					moduleExports: 'mock-file-a'
				},
				{
					name: 'mock-subdir-1/b',
					fullPath: '/mock-dir/mock-subdir-1/b.JS',
					extension: '.js',
					moduleExports: 'mock-file-b'
				},
				{
					name: 'mock-subdir-1/mock-subdir-2/c',
					fullPath: '/mock-dir/mock-subdir-1/mock-subdir-2/c.json',
					extension: '.json',
					moduleExports: 'mock-file-c'
				}
			]);
		});
	});

	describe('requireAll(directoryPath, options)', () => {
		let returnValue;

		beforeEach(() => {
			returnValue = requireAll('/mock-dir', {
				extensions: ['.js', '.ts']
			});
		});

		it('returns an array of module info objects, including file types defined in `options.extensions`', () => {
			assert.ok(Array.isArray(returnValue));
			assert.deepStrictEqual(returnValue, [
				{
					name: 'a',
					fullPath: '/mock-dir/a.js',
					extension: '.js',
					moduleExports: 'mock-file-a'
				},
				{
					name: 'mock-subdir-1/b',
					fullPath: '/mock-dir/mock-subdir-1/b.JS',
					extension: '.js',
					moduleExports: 'mock-file-b'
				},
				{
					name: 'd',
					fullPath: '/mock-dir/d.ts',
					extension: '.ts',
					moduleExports: 'mock-file-d'
				}
			]);
		});
	});

	describe('.default', () => {
		it('aliases the module exports', () => {
			assert.strictEqual(requireAll, requireAll.default);
		});
	});
});
