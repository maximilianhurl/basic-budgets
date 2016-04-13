import React from 'react-native';
import objectMap from '../utils/objectMap';
import { BudgetBlockItem } from './BudgetBlockItem';
import { COLOURS } from '../utils/styles';

let {
  Text, View, TextInput, TouchableHighlight,
  PanResponder, Animated, LayoutAnimation, Alert,
  StyleSheet
} = React;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
  },
  innerContainer: {
    backgroundColor: COLOURS.LIGHTBLUE,
    padding: 10,
  }
});


export class BudgetBlock extends React.Component {

  constructor(props) {
    super(props);

    this.layoutYPos = 0;

    this.state = {
      pan: new Animated.ValueXY(0, 0),
      reordering: false,
    };
  }

  animatePositionChange() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  dragEnded() {
    this.setState({
      reordering: false
    });

    this.props.dragEndedCallback();
    Animated.spring(this.state.pan, {
      toValue: 0,   // Returns to the start
      tension: 200, //speed
      friction: 12, //overshoot
    }).start();
  }

  onLayout(e) {
    this.layoutYPos = e.nativeEvent.layout.y;
    this.props.onLayout(e);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder : () => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        this.props.dragStartCallback();
        this.setState({
          reordering: true
        });
      },
      onPanResponderMove: (event) => {
        const gestureYPos = (event.nativeEvent.pageY - this.layoutYPos - this.props.yOffset) + this.props.scrollOffset;

        const touches = event.touchHistory.touchBank[1];
        const movingDown = touches.previousPageY < touches.currentPageY ? true : false;

        this.state.pan.setValue({x: 0, y: gestureYPos});
        this.props.dragMoveCallback(this.props.blockId, event.nativeEvent.pageY, movingDown);
      },
      onPanResponderRelease: () => this.dragEnded(),
      onPanResponderTerminate: () => this.dragEnded(),
    });
  };

  removeBlock() {
    this.props.budgetactions.removeBudgetBlock(
      this.props.blockId
    );
  };

  addBudgetBlockItem() {
    this.props.budgetactions.addBudgetBlockItem(this.props.blockId, 'New outgoing', '0');
  };

  updateTitle(title) {
    this.props.budgetactions.updateBudgetBlockTitle(
      this.props.blockId, title
    );
  };

  renderRemoveButton() {
    if (this.props.uistore.editControlsVisible) {
      return (<TouchableHighlight
        onPress={() => Alert.alert(
          'Are you sure you want to remove this block?',
          null,
          [
            {text: 'Remove', onPress: () => this.removeBlock()},
            {text: 'Cancel'},
          ]
        )}>
        <Text
          style={{height: 40, width: 200, backgroundColor: 'gray', color: 'white', marginTop: 10}}>
          Remove Block
        </Text>
      </TouchableHighlight>);
    }
    return null;
  }

  render() {

    let budgets = objectMap(this.props.budgetBlock.items).map(item => {
      return (
        <BudgetBlockItem
          key={item.key}
          blockItem={item.obj}
          blockItemId={item.key}
          blockId={this.props.blockId}
          uistore={this.props.uistore}
          budgetactions={this.props.budgetactions}
          />
      );
    });

    return (
      <Animated.View ref="outerView" onLayout={(e) => this.onLayout(e)} style={[
        { backgroundColor: this.state.reordering ? 'gray' : 'transparent' },
        styles.container
      ]}>
        <Animated.View style={[{top: this.state.pan.y}, styles.innerContainer]}>

          <Text {...this.panResponder.panHandlers}>MOVE ME</Text>

          <Text>Block Title: { this.props.budgetBlock.title }</Text>
          <TextInput
            style={{height: 20, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white'}}
            onChangeText={(text) => this.updateTitle(text)}
            value={ this.props.budgetBlock.title } />

          { this.renderRemoveButton() }

          { budgets }

          <TouchableHighlight onPress={() => this.addBudgetBlockItem()}>
            <Text
              style={{height: 40, width: 200, backgroundColor: 'gray', color: 'white', marginTop: 10}}>
              Add outgoing
            </Text>
          </TouchableHighlight>

          <Text>Subtotal: £{ this.props.budgetBlock.subtotal }</Text>

        </Animated.View>
      </Animated.View>
    );
  }
}
