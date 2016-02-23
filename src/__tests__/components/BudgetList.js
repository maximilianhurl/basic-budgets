    /* global jest, describe, it, expect */
jest.dontMock('../../components/BudgetList');

import TestUtils from 'react-addons-test-utils';
import React from 'react-native'; // eslint-disable-line no-unused-vars

// cannot use es6 modules syntax because
// jest.dontMock & jest.autoMockOff()
// do not understand ES6 modules yet
const BudgetList = require('../../components/BudgetList').BudgetList;

describe('BudgetList', function () {

  const ReactNotNative = require('react'); // eslint-disable-line no-unused-vars

  var budgetstore = {
    budgets: {}
  };

  it('should render data correctly', function () {

    budgetstore = {
      budgets: {
        id1: {},
        id2: {}
      },
      getOrderedBlocks: function () {
        return [
          { key: 'id1', obj: {} },
          { key: 'id2', obj: {} },
        ];
      },
      income: 120
    };

    var budgetactions = {
      addBudgetBlock: () => {},
      updateIncome: () => {}
    };

    var persistenceactions = {
      persistState: () => {},
      loadPersistentState: () => {}
    };

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetstore={budgetstore}
      budgetactions={budgetactions}
      persistenceactions={persistenceactions}/>);
    var output = shallowRenderer.getRenderOutput();
    expect(output).toBeTruthy();
  });

  it('should add budget block', function () {
    var actions = {
      addBudgetBlock: jest.genMockFunction()
    };
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetactions={actions}
      budgetstore={budgetstore} />);
    var output = shallowRenderer.getRenderOutput();
    output.props.children[3].props.onPress();
    expect(actions.addBudgetBlock).toBeCalledWith('New outgoing block');
  });

  it('should add budget block', function () {
    var actions = {
      updateIncome: jest.genMockFunction()
    };
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetactions={actions}
      budgetstore={budgetstore} />);
    var output = shallowRenderer.getRenderOutput();
    output.props.children[1].props.onChangeText('cats');
    expect(actions.updateIncome).toBeCalledWith('cats');
  });

  it('should attach listeners to scroll view', function () {
    budgetstore = {
      getOrderedBlocks: function () {
        return [];
      },
    };

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetactions={{}}
      budgetstore={budgetstore} />);
    var output = shallowRenderer.getRenderOutput();
    var instance = shallowRenderer._instance._instance;

    instance.onScroll = jest.genMockFunction();
    instance.onLayout = jest.genMockFunction();

    output.props.onScroll('cat');
    output.props.onLayout('seagull');

    expect(instance.onScroll).toBeCalledWith('cat');
    expect(instance.onLayout).toBeCalledWith('seagull');
  });

  it('should attach listeners to block items view', function () {
    budgetstore = {
      budgets: {
        id1: {},
      },
      getOrderedBlocks: function () {
        return [
          { key: 'id1', obj: {} },
        ];
      },
      income: 120
    };

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetactions={{}}
      budgetstore={budgetstore} />);
    var output = shallowRenderer.getRenderOutput();
    var instance = shallowRenderer._instance._instance;

    let blocks = output.props.children[2];

    instance.handleItemLayout = jest.genMockFunction();
    instance.dragStartCallback = jest.genMockFunction();
    instance.dragEndedCallback = jest.genMockFunction();
    instance.dragMoveCallback = jest.genMockFunction();

    blocks[0].props.onLayout('cat1');
    blocks[0].props.dragStartCallback();
    blocks[0].props.dragEndedCallback();
    blocks[0].props.dragMoveCallback('cat4', 'cat5', 'cat6');

    expect(instance.handleItemLayout ).toBeCalledWith('cat1', 'id1');
    expect(instance.dragStartCallback).toBeCalled();
    expect(instance.dragEndedCallback).toBeCalled();
    expect(instance.dragMoveCallback ).toBeCalledWith('cat4', 'cat5', 'cat6');
  });

  it('should hanlde event call backs', function () {
    budgetstore = {
      budgets: {},
      getOrderedBlocks: () => [],
      income: 0
    };

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BudgetList
      budgetactions={{}}
      budgetstore={budgetstore} />);
    shallowRenderer.getRenderOutput();
    var instance = shallowRenderer._instance._instance;
    // scroll
    instance.onScroll({
      nativeEvent: {
        contentOffset: {
          y: '120'
        }
      }
    });
    expect(instance.scrollOffset).toEqual('120');
    // layout
    instance.onLayout({
      nativeEvent: {
        layout: {
          y: '110'
        }
      }
    });
    expect(instance.yPos).toEqual('110');
    // drag end callback
    instance.dragStartCallback();
    expect(instance.state.reordering).toEqual(true);
    // drag start callback
    instance.dragEndedCallback();
    expect(instance.state.reordering).toEqual(false);
    // handleItemLayout
    instance.handleItemLayout({
      nativeEvent: {
        layout: 'cat layout'
      }
    }, 'cat');
    expect(instance.layouts['cat']).toEqual('cat layout');
  });

});
