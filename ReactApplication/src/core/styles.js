import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    marginTop: 70,
    flex: 1,
    alignItems: "center",
    flexDirection: 'column'
  },
  activityIndicator: {
    height: 50
  },
  tasksList: {
    width: width
  }
});

export default styles;