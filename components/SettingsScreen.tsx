import React from 'react';
import {View} from 'react-native';
import CheckboxSetting from './CheckboxSetting';

type Settings = {
  darkMode: Boolean;
  cardColors: Boolean;
};

function SettingsScreen({
  settings: Settings,
  onSettingsChanged = () => {},
}): React.JSX.Element {
  return (
    <View>
      <CheckboxSetting title="Dark mode" />
      <CheckboxSetting title="Show card colors" />
    </View>
  );
}

export default SettingsScreen;
export type {Settings};
