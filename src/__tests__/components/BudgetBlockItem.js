/* global jest, describe, it, expect, beforeEach */
jest.dontMock('../../components/BudgetBlockItem');

jest.setMock('react-native-vector-icons/Ionicons', require('../../__mocks__/Ionicons'));

import TestUtils from 'react-addons-test-utils';
import { View, TextInput, TouchableOpacity, Text } from 'react-native'; // eslint-disable-line no-unused-vars
import React from 'react';  // eslint-disable-line no-unused-vars

// cannot use es6 modules syntax because
// jest.dontMock & jest.autoMockOff()
// do not understand ES6 modules yet
var BudgetBlockItem = require('../../components/BudgetBlockItem').BudgetBlockItem;

describe('BudgetBlockItem', function () {

  const ReactNotNative = require('react'); // eslint-disable-line no-unused-vars

  var blockId = 'id1';
  var blockItemId = 'idItem1';
  var blockItem = {
    title: 'cat',
    value: 10
  };

  var uistore = {
    editControlsVisible: true
  };

  var actions;

  beforeEach(function() {
    actions = {
      updateBudgetBlockItemTitle: jest.genMockFunction(),
      removeBudgetBlockItem: jest.genMockFunction(),
      updateBudgetBlockItemValue: jest.genMockFunction(),
    };
  });

  it('should render data correctly', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetBlockItem
      blockId={blockId}
      blockItemId={blockItemId}
      uistore={uistore}
      blockItem={blockItem}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
    expect(output.props.children[0].props.value).toEqual(blockItem.title);
    expect(output.props.children[2].props.value).toEqual(String(blockItem.value));
  });

  it('should update title', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetBlockItem
      blockId={blockId}
      blockItemId={blockItemId}
      budgetactions={actions}
      uistore={uistore}
      blockItem={blockItem}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
    output.props.children[0].props.onChangeText('cats');
    expect(actions.updateBudgetBlockItemTitle).toBeCalledWith(blockId, blockItemId, 'cats');
  });

  it('should update value', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetBlockItem
      blockId={blockId}
      blockItemId={blockItemId}
      budgetactions={actions}
      uistore={uistore}
      blockItem={blockItem}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
    output.props.children[2].props.onChangeText('cats');
    expect(actions.updateBudgetBlockItemValue).toBeCalledWith(blockId, blockItemId, 'cats');
  });

  it('should remove block', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetBlockItem
      blockId={blockId}
      blockItemId={blockItemId}
      uistore={uistore}
      budgetactions={actions}
      blockItem={blockItem}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
    output.props.children[3].props.onPress();
    expect(actions.removeBudgetBlockItem).toBeCalledWith(blockId, blockItemId);
  });

  it('should not render remove', function () {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetBlockItem
      blockId={blockId}
      blockItemId={blockItemId}
      uistore={{ editControlsVisible: false }}
      budgetactions={{}}
      blockItem={blockItem}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output.props.children[3]).toBe(null);
  });


});
