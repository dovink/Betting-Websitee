import React from 'react';

function Football({ onOptionClick }) {
  return (
    <div>
      <h2 className="font-bold">Futbolo spėlionė</h2>
      <ul>
      <button onClick={() => onOptionClick('Futbolas')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
        <li>Pasaulio čempionatas</li>
        </button>
        <li>Europos čempionatas</li>
      </ul>
    </div>
  );
}

export default Football;
