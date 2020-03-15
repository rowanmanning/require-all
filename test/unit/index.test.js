'use strict';

const assert = require('proclaim');

describe('index', () => {
	let index;
	let requireAll;

	beforeEach(() => {
		index = require('../../index');
		requireAll = require('../../lib/require-all');
	});

	it('aliases `lib/require-all`', () => {
		assert.strictEqual(index, requireAll);
	});

});
