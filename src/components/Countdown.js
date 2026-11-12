import React from 'react';

const Countdown = ({ count }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1 style={{ fontSize: '96px', margin: 0 }}>{count}</h1>
    </div>
  );
};

export default Countdown;