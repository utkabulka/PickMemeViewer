import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {StyleSheet, Text, View} from 'react-native';

type CheckboxSettingProps = {
  title: string;
  value: boolean;
  onSwitch: (value: boolean) => void;
};

function CheckboxSetting({
  title = 'Checkbox setting',
  value = false,
  onSwitch,
}: CheckboxSettingProps): React.JSX.Element {
  return (
    <View style={style.settingContainer}>
      <CheckBox value={value} onValueChange={onSwitch} />
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
