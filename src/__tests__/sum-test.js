jest.dontMock('../lib/sum'); // or jest.autoMockOff();
jest.dontMock('../app');


// cannot use es6 modules syntax because
// jest.dontMock & jest.autoMockOff()
// do not understand ES6 modules yet
const sum = require('../lib/sum');

describe('sum', function () {

  const nav = require('../components/BudgetBlock');

  it('adds 1 + 2 to equal 3', () =>  expect(sum(1, 2)).toBe(3))
});
