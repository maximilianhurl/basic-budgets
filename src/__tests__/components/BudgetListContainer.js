/* global jest, describe, it, expect */
jest.dontMock('../../components/BudgetListContainer');

jest.setMock('../../alt', require('../../__mocks__/alt'));
jest.setMock('alt-container/native', require('../../__mocks__/native'));
jest.setMock('react-native-vector-icons/Ionicons', require('../../__mocks__/Ionicons'));

import TestUtils from 'react-addons-test-utils';
import React from 'react';  // eslint-disable-line no-unused-vars

// cannot use es6 modules syntax because
// jest.dontMock & jest.autoMockOff()
// do not understand ES6 modules yet
const BudgetListContainer = require('../../components/BudgetListContainer').BudgetListContainer;

describe('BudgetListContainer', function () {

  const ReactNotNative = require('react'); // eslint-disable-line no-unused-vars

  it('should render data correctly', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetListContainer />);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
  });

});
