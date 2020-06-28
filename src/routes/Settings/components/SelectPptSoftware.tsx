import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, IDropdownOption as Opt } from '@fluentui/react';
import { RootContext } from 'wrappers';
import { OPTIONS } from 'const';

const DROPDOWN_OPTIONS: Opt[] = [
  { key: 'powerpoint', text: 'Powerpoint' },
  { key: 'keynote', text: 'Keynote' },
  { key: 'keynote', text: 'Keynote 6' },
];

export const SelectPptSoftware: React.FC = () => {
  const { setNeedsRestart } = useContext(RootContext);
  const [value, setValue] = useState(OPTIONS.PPT_SW);

  useEffect(() => {
    if (localStorage.pptSoftware === value) return;

    localStorage.pptSoftware = value;
    setNeedsRestart(true);
  }, [setNeedsRestart, value]);

  return (
    <Dropdown
      label='Presentation Software'
      selectedKey={value || 'auto'}
      onChange={(_, item): void => setValue(item.key as string)}
      placeholder='Select an option'
      options={DROPDOWN_OPTIONS}
    />
  );
};
