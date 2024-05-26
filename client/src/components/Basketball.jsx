import React from 'react';

function Basketball({ onOptionClick }) {
  return (
    <div>
      <h2 className="font-bold">Krepšinio spėlionė</h2>
      <ul>
        <li>Eurolyga</li>
        <li>NBA playoffs</li>
        <li>Pasaulio čempionatas</li>
        <button onClick={() => onOptionClick('Eurolyga')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
        <li>Europos čempionatas</li>
        </button>
        <li>Olimpinės žaidynės</li>
      </ul>
    </div>
  );
}

export default Basketball;
