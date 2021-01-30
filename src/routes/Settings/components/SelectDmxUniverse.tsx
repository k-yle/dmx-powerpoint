import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@fluentui/react';
import { RootContext } from 'wrappers';
import { OPTIONS } from 'const';

const isValidUniverse = (n: number): boolean =>
  !Number.isNaN(n) && n >= 1 && n <= 65333;

export const SelectDmxUniverse: React.FC = () => {
  const { setNeedsRestart } = useContext(RootContext);
  const [value, setValue] = useState<string>(OPTIONS.UNIVERSE);

  useEffect(() => {
    if (!isValidUniverse(+value)) return;
    if (localStorage.universe === value) return;

    localStorage.universe = value;
    setNeedsRestart(true);
  }, [setNeedsRestart, value]);

  return (
    <TextField
      label='sACN Universe'
      value={value}
      onChange={(_, v): void => setValue(v)}
      errorMessage={
        !isValidUniverse(+value) && 'Must be a number between 1 and 65335?'
      }
    />
  );
};
