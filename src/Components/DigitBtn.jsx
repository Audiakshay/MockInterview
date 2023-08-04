import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const dim = Dimensions.get('window').width;

const DigitBtn = ({style, digit, onPress}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styles.digit}>{digit}</Text>
    </TouchableOpacity>
  );
};

export default DigitBtn;

const styles = StyleSheet.create({
  digit: {
    color: '#FFF',
    fontSize: dim / 11,
    fontWeight: '500',
  },
});
