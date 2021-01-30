import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import { RootContext } from 'wrappers';
import {
  SelectIface,
  SelectDmxStartAddress,
  SelectDmxUniverse,
  SelectPptSoftware,
} from './components';

export const Settings: React.FC = () => {
  const { needsRestart } = useContext(RootContext);
  return (
    <div>
      <div>
        <h2 style={{ display: 'inline-block' }}>Settings</h2>
        <Link to='/' style={{ float: 'right' }}>
          <PrimaryButton text='Back' />
        </Link>
      </div>
      <div style={{ margin: '12px 0' }}>Changes are automatically saved.</div>
      {needsRestart && (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
          You need to restart this app for these changes to take effect.
        </MessageBar>
      )}
      <SelectIface />
      <SelectDmxUniverse />
      <SelectDmxStartAddress />
      <SelectPptSoftware />
    </div>
  );
};
