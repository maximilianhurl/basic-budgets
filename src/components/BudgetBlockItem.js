import React from 'react-native';
import { GLOBAL_STYLES, COLOURS } from '../utils/styles';
import Icon from 'react-native-vector-icons/Ionicons';

let { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLOURS.DARKBUTTON,
  },
  title: {
    flex: 0.6,
  },
  total: {
    marginLeft: 5,
  },
  input: {
    flex: 0.4,
    height: 20,
    color: COLOURS.DARKTEXT,
    margin: 0,
    padding:0,
    marginBottom: 5,
  },
  removeButton: {
    flex: 0.1,
  },
  removeButtonText: {
    textAlign: 'right'
  },
  currency: {
    fontSize: 16,
  }
});


export class BudgetBlockItem extends React.Component {

  updateValue(value) {
    this.props.budgetactions.updateBudgetBlockItemValue(
      this.props.blockId, this.props.blockItemId, value
    );
  }

  updateTitle(title) {
    this.props.budgetactions.updateBudgetBlockItemTitle(
      this.props.blockId, this.props.blockItemId, title
    );
  }

  removeBlockItem() {
    this.props.budgetactions.removeBudgetBlockItem(
      this.props.blockId, this.props.blockItemId
    );
  }

  renderRemoveButton() {
    if (this.props.uistore.editControlsVisible) {
      return (<TouchableOpacity
        underlayColor={COLOURS.TOUCHHIGHLIGHT}
        style={[styles.removeButton]}
        onPress={() => Alert.alert(
          'Are you sure you want to remove this outgoing?',
          null,
          [
            {text: 'Remove', onPress: () => this.removeBlockItem()},
            {text: 'Cancel'},
          ]
        )}>
        <Text style={[styles.removeButtonText]}>
          <Icon name="close-circled" size={20} color="black" />
        </Text>
      </TouchableOpacity>);
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container]}>
        <TextInput
          style={[styles.input, styles.title, GLOBAL_STYLES.REGULARFONT]}
          onChangeText={(text) => this.updateTitle(text)}
          value={ this.props.blockItem.title } />
        <Text style={[styles.currency, GLOBAL_STYLES.BOLDFONT]}>
          { this.props.uistore.currencySymbol }
        </Text>
        <TextInput
          style={[styles.input, styles.total]}
          onChangeText={(text) => this.updateValue(text)}
          keyboardType={'numeric'}
          value={this.props.blockItem.value} />

        { this.renderRemoveButton() }

      </View>
    );
  }
}
