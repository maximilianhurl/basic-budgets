/* global jest, describe, it, expect, beforeEach */

jest.dontMock('../../stores/PersistenceStore');
jest.setMock('../../alt', require('../../__mocks__/alt'));
jest.setMock('react-native', require('../../__mocks__/react-native'));


import alt from '../../alt';
import React from 'react-native';

describe('Test PersistenceStore', function () {

  var store, persistenceActions;

  beforeEach(function () {
    require('../../stores/PersistenceStore').default;
    persistenceActions = require('../../actions/PersistenceActions');
    const PersistenceStore = require('../../stores/PersistenceStore').PersistenceStore;
    PersistenceStore.prototype.bindActions = jest.genMockFunction();
    PersistenceStore.prototype.bindListeners = jest.genMockFunction();
    PersistenceStore.prototype.waitFor = jest.genMockFunction();
    store = new PersistenceStore();
  });

  it('Should persist state', function () {

    const snapshot = 'internal cats';

    alt.takeSnapshot = jest.genMockFunction().mockReturnValueOnce(snapshot);
    React.AsyncStorage.setItem = jest.genMockFunction().mockReturnValue({
      then: () => {
        return {
          catch: () => {}
        };
      }
    });

    store.onPersistState();
    expect(React.AsyncStorage.setItem.mock.calls.length).toBeGreaterThan(0);
    expect(React.AsyncStorage.setItem).lastCalledWith('@BudgetBlocks:state-data', snapshot);
    expect(store.bindActions).lastCalledWith(persistenceActions);
    expect(store.bindListeners).toBeCalled();
    expect(store.waitFor).toBeCalled();
  });

  it('Should load state', function () {

    const snapshot = 'saved cats';

    alt.bootstrap = jest.genMockFunction();
    React.AsyncStorage.getItem = jest.genMockFunction().mockReturnValue({
      then: (callback) => {
        callback(snapshot);
        return {
          catch: () => {}
        };
      }
    });

    store.onLoadPersistentState();
    expect(alt.bootstrap.mock.calls.length).toBeGreaterThan(0);
    expect(React.AsyncStorage.getItem.mock.calls.length).toBeGreaterThan(0);
    expect(alt.bootstrap).lastCalledWith(snapshot);
  });


});
