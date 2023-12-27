import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {StyleSheet, Text, View} from 'react-native';

function CheckboxSetting({
  title = 'Checkbox setting',
  value = false,
  onSwitch = () => {},
}): React.JSX.Element {
  return (
    <View style={style.settingContainer}>
      <CheckBox value={value} onChange={onSwitch} />
      <Text>{title}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  settingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CheckboxSetting;
