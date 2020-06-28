import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';

export const Help: React.FC = () => {
  return (
    <div>
      <div>
        <h2 style={{ display: 'inline-block' }}>Help</h2>
        <Link to='/' style={{ float: 'right' }}>
          <PrimaryButton text='Back' />
        </Link>
      </div>
      <p>
        <strong>Channel1:</strong> <br />
        0% = nothing <br />
        1-99% = go to slides 1 - 99 <br />
        100% = nothing <br />
        <strong>Channel 2:</strong> <br />
        0-19% = nothing <br />
        20-39% = previous slide <br />
        40-59% = nothing <br />
        60-79% = next slide <br />
        80-99% = nothing <br />
        100% = next slide <br />
      </p>
    </div>
  );
};
