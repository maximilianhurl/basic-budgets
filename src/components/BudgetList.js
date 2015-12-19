import React from 'react-native';
let { Text, ScrollView, TouchableHighlight, TextInput } = React;
import { BudgetBlock } from './BudgetBlock';
import objectMap from '../utils/objectMap';

export class BudgetList extends React.Component {

  addBudgetBlock() {
    this.props.budgetactions.addBudgetBlock('New outgoing block');
  }

  updateIncome(text) {
    this.props.budgetactions.updateIncome(text);
  }

  render() {

    let budgets = objectMap(this.props.budgetstore.budgets).map(item => {
      return (
        <BudgetBlock
          budgetBlock={item.obj}
          key={item.key}
          blockId={item.key}
          budgetactions={this.props.budgetactions}
          income={this.props.budgetstore.income}/>
      );
    });

    return (
      <ScrollView style={{ marginTop: 60 }}>

        <Text>Income: £ { this.props.budgetstore.income }</Text>
        <TextInput
          style={{height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', marginBottom: 20}}
          onChangeText={(text) => this.updateIncome(text)}
          keyboardType={'numeric'}
          value={this.props.budgetstore.income} />

        { budgets }

        <TouchableHighlight onPress={() => this.addBudgetBlock()}>
          <Text
            style={{height: 40, width: 270, backgroundColor: 'gray', color: 'white', marginTop: 10}}
            >
            Add Block
          </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.props.persistenceactions.persistState()}>
          <Text
            style={{height: 40, width: 270, backgroundColor: 'gray', color: 'white', marginTop: 10}}
            >
            Save State
          </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.props.persistenceactions.loadPersistentState()}>
          <Text
            style={{height: 40, width: 270, backgroundColor: 'gray', color: 'white', marginTop: 10}}
            >
            Load State
          </Text>
        </TouchableHighlight>


      </ScrollView>
    );
  }
}
