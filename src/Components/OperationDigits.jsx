import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const dim = Dimensions.get('window').width;

const OperationDigits = ({style, digit, onPress, btnNum}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={btnNum}>{digit}</Text>
    </TouchableOpacity>
  );
};

export default OperationDigits;
