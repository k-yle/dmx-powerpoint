import React, { useState, useMemo, useEffect, useContext } from 'react';
import { networkInterfaces } from 'os';
import { Dropdown, IDropdownOption as Opt } from '@fluentui/react';
import { RootContext } from 'wrappers';
import { OPTIONS } from 'const';

const DEFAULT_OPT: Opt = { key: 'auto', text: 'Automatically Select' };

const onRenderOption = (option: Opt): JSX.Element => {
  return (
    <div>
      <span>
        {option.text}
        <br />
        <em>{option.data?.cidr}</em>
      </span>
    </div>
  );
};

export const SelectIface: React.FC = () => {
  const { setNeedsRestart } = useContext(RootContext);
  const [value, setValue] = useState<string>(OPTIONS.IFACE);

  const ifaceOptions = useMemo<Opt[]>(() => {
    const networkAdaptors = Object.entries(networkInterfaces());
    return [
      DEFAULT_OPT,
      ...networkAdaptors
        .map(([adaptorName, ifaces]) => {
          // TODO: support ipv6 once the sACN package does
          const ipv4SubFace = ifaces.find((x) => x.family === 'IPv4');
          return {
            key: ipv4SubFace.address,
            text: adaptorName,
            data: ipv4SubFace,
          };
        })
        .filter(Boolean),
    ];
  }, []);

  useEffect(() => {
    if (localStorage.iface === value) return;

    localStorage.iface = value;
    setNeedsRestart(true);
  }, [setNeedsRestart, value]);

  return (
    <Dropdown
      label='Network Interface'
      selectedKey={value || 'auto'}
      onChange={(_, item): void => setValue(item.key as string)}
      placeholder='Select an option'
      options={ifaceOptions}
      onRenderOption={onRenderOption}
    />
  );
};
