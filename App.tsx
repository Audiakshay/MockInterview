/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React from 'react';
import GroceryList from './src/Screens/GroceryList';
import HomeScreen from './src/Components/HomeScreen';
import Calculator from './src/Screens/Calculator';


const dimension = Dimensions.get('window').width;

const App = () => {
  return (
    // <SafeAreaView style={styles.container}>
    //   <HomeScreen />
    // </SafeAreaView>
    <Calculator />
  );
};
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: dimension / 10,
//     color: '#37B63B',
//     fontWeight: '900',
//   },
// });
export default App;
