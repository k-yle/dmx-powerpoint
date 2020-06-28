import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@fluentui/react';
import { RootContext } from 'wrappers';
import { OPTIONS } from 'const';

const isValidStartAddr = (n: number): boolean =>
  !Number.isNaN(n) && n >= 1 && n <= 511; // 511 beacuse it is a 2ch fixture profile so can't start at 512

export const SelectDmxStartAddress: React.FC = () => {
  const { setNeedsRestart } = useContext(RootContext);
  const [value, setValue] = useState<string>(OPTIONS.START_ADDR);

  useEffect(() => {
    if (!isValidStartAddr(+value)) return;
    if (localStorage.startAddr === value) return;

    localStorage.startAddr = value;
    setNeedsRestart(true);
  }, [setNeedsRestart, value]);

  return (
    <TextField
      label='DMX Start Address'
      value={value}
      onChange={(_, v): void => setValue(v)}
      errorMessage={
        !isValidStartAddr(+value) && 'Must be a number between 1 and 65335?'
      }
    />
  );
};
