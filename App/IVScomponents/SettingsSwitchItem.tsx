import React from 'react';
import { StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import SettingsItem from './SettingsItem';

type Props = {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
  testID?: string;
};

const SettingsSwitchItem = ({ label, onValueChange, value, testID }: Props) => (
  <SettingsItem label={label} style={styles.item}>
    <Switch
      onValueChange={onValueChange}
      value={value}
      color={'#3498db'}
      testID={testID}
    />
  </SettingsItem>
);

const styles = StyleSheet.create({
  item: {
    width: '50%',
  },
});

export default SettingsSwitchItem;
