import React from 'react';
import {View} from 'react-native';
import CheckboxSetting from './CheckboxSetting';

type Settings = {
  darkMode: boolean;
  showCardColors: boolean;
};

type SettingsProps = {
  settings: Settings;
  onSettingsChanged: (key: string, value: string | number | boolean) => void;
};

function SettingsScreen({
  settings,
  onSettingsChanged,
}: SettingsProps): React.JSX.Element {
  return (
    <View>
      <CheckboxSetting
        title="Dark mode"
        value={settings.darkMode}
        onSwitch={(value: boolean) => {
          onSettingsChanged('darkMode', value);
        }}
      />
      <CheckboxSetting
        title="Show card colors"
        value={settings.showCardColors}
        onSwitch={(value: boolean) => {
          onSettingsChanged('showCardColors', value);
        }}
      />
    </View>
  );
}

export default SettingsScreen;
export type {Settings};
