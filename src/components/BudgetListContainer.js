import React from 'react-native';
import AltContainer from 'alt-container/native';
import BudgetActions from '../actions/BudgetActions';
import BudgetStore from '../stores/BudgetStore';
import { BudgetList } from './BudgetList';
import '../stores/PersistenceStore';

export class BudgetListContainer extends React.Component {

  render() {

    return (
      <AltContainer
        stores={
          {
            budgetstore: BudgetStore
          }
        }
        actions={
          {
            budgetactions: BudgetActions,
          }
        }>
        <BudgetList/>
      </AltContainer>
    );
  }
}
