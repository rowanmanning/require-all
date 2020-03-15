'use strict';

const assert = require('proclaim');
const mockery = require('mockery');

describe('lib/require-all', () => {
	let listAllFiles;
	let mockFiles;
	let requireAll;

	beforeEach(() => {
		listAllFiles = require('../mock/npm/@rowanmanning/list-all-files');
		mockery.registerMock('@rowanmanning/list-all-files', listAllFiles);

		mockFiles = {
			fileA: 'mock-file-a',
			fileB: 'mock-file-b',
			fileC: 'mock-file-c',
			fileD: 'mock-file-d',
			fileE: 'mock-file-e'
		};
		mockery.registerMock('/mock-dir/a.js', mockFiles.fileA);
		mockery.registerMock('/mock-dir/mock-subdir-1/b.JS', mockFiles.fileB);
		mockery.registerMock('/mock-dir/mock-subdir-1/mock-subdir-2/c.json', mockFiles.fileC);
		mockery.registerMock('/mock-dir/d.ts', mockFiles.fileD);

		listAllFiles.sync.returns([
			'/mock-dir/a.js',
			'/mock-dir/mock-subdir-1/b.JS',
			'/mock-dir/mock-subdir-1/mock-subdir-2/c.json',
			'/mock-dir/d.ts',
			'/mock-dir/e.txt'
		]);

		requireAll = require('../../../lib/require-all');
	});

	it('exports a function', () => {
		assert.isFunction(requireAll);
	});

	describe('requireAll(directoryPath)', () => {
		let returnValue;

		beforeEach(() => {
			returnValue = requireAll('/mock-dir');
		});

		it('returns an array of module info objects, ignoring non JS and JSON files', () => {
			assert.isArray(returnValue);
			assert.deepEqual(returnValue, [
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
				extensions: [
					'.js',
					'.ts'
				]
			});
		});

		it('returns an array of module info objects, including file types defined in `options.extensions`', () => {
			assert.isArray(returnValue);
			assert.deepEqual(returnValue, [
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

});
