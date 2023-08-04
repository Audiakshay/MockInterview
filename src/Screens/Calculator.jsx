import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useReducer} from 'react';
import DigitBtn from '../Components/DigitBtn';
import OperationDigits from '../Components/OperationDigits';

const dim = Dimensions.get('window').width;

const Integer_Formatter = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) {
    return;
  }
  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    return Integer_Formatter.format(integer);
  }
  return `${Integer_Formatter.format(integer)}.${decimal}`;
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  console.log(previousOperand);
  const p = parseFloat(previousOperand);
  const c = parseFloat(currentOperand);

  let computation = '';
  if (isNaN(p) && isNaN(c)) {
    return '';
  }
  switch (operation) {
    case '+':
      computation = p + c;
      break;
    case '-':
      computation = p - c;
      break;
    case '×':
      computation = p * c;
      break;
    case '÷':
      computation = p / c;
      break;

    default:
      break;
  }
  return computation.toString();
};
const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'add-digit':
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit === 0 && Number(state.currentOperand) === 0) {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand?.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case 'all-clear':
      return {};
    case 'delete-digit':
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null};
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case 'choose-operands':
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.digit,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.digit,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.digit,
        currentOperand: null,
      };
    case 'equal-operand':
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
      };
    case 'percentage-operand':
      if (state.currentOperand == null) {
        return state;
      }
      return {
        ...state,
        currentOperand: (state.currentOperand / 100).toString(),
      };
    case 'sign-converter':
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand > 0) {
        return {
          ...state,
          currentOperand: '-' + state.currentOperand,
        };
      }
      if (state.currentOperand[0] === '-') {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(1),
        };
      }
  }
};

const Calculator = () => {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer,
    {},
  );
  const btn = [
    'AC',
    '+/-',
    '%',
    '÷',
    7,
    8,
    9,
    '×',
    4,
    5,
    6,
    '-',
    1,
    2,
    3,
    '+',
    0,
    '.',
    '=',
  ];
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'];
  const operands = ['÷', '×', '-', '+', '='];
  const symb1Color = {
    backgroundColor: '#FF8922',
  };
  const symb2Color = {
    backgroundColor: '#1D2B3A',
  };

  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {currentOperand
            ? formatOperand(currentOperand)
            : formatOperand(previousOperand)}
        </Text>
      </View>
      <View style={styles.innerContainer}>
        <FlatList
          data={btn}
          numColumns={4}
          key={4}
          keyExtractor={item => item}
          renderItem={({item}) =>
            digits.includes(item) ? (
              <DigitBtn
                style={
                  item === 0
                    ? [styles.growBtn, symb2Color]
                    : item === '.'
                    ? [styles.button, {justifyContent: 'flex-start'}]
                    : styles.button
                }
                digit={item}
                onPress={() =>
                  dispatch({type: 'add-digit', payload: {digit: item}})
                }
              />
            ) : operands.includes(item) ? (
              <OperationDigits
                style={
                  item === operation
                    ? [styles.button, {backgroundColor: '#FFF'}]
                    : [styles.button, symb1Color]
                }
                digit={item}
                onPress={
                  item === '='
                    ? () => dispatch({type: 'equal-operand'})
                    : () =>
                        dispatch({
                          type: 'choose-operands',
                          payload: {digit: item},
                        })
                }
                btnNum={
                  item === operation
                    ? [styles.btnNum, {color: '#FF8922'}]
                    : [styles.btnNum, {color: '#FFF'}]
                }
              />
            ) : (
              <TouchableOpacity
                onPress={
                  item === '%'
                    ? () => dispatch({type: 'percentage-operand'})
                    : item === 'AC'
                    ? () => dispatch({type: 'all-clear'})
                    : () => dispatch({type: 'sign-converter'})
                }
                style={[styles.button, {backgroundColor: '#FFF'}]}>
                <Text style={styles.btnNum}>{item}</Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  value: {
    color: '#FFF',
    fontSize: dim / 4,
  },

  button: {
    backgroundColor: '#1D2B3A',
    width: dim / 5,
    height: dim / 5,
    borderRadius: dim,
    justifyContent: 'center',
    alignItems: 'center',
    margin: dim / 70,
  },
  btnNum: {
    color: '#000',
    fontSize: dim / 11,
    fontWeight: '500',
  },
  growBtn: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    borderRadius: dim,
    justifyContent: 'center',
    paddingLeft: dim / 15,
    margin: dim / 70,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
});
export default Calculator;
