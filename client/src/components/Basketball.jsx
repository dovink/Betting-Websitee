import React from 'react';

function Basketball({ onOptionClick }) {
  return (
    <div>
      <h2 className="font-bold">Krepšinio spėlionė</h2>
      <ul>
        <li>
          <button onClick={() => onOptionClick('Eurolyga')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
            Eurolyga
          </button>
        </li>
        <li>NBA playoffs</li>
        <li>Pasaulio čempionatas</li>
        <li>Europos čempionatas</li>
        <li>Olimpinės žaidynės</li>
      </ul>
    </div>
  );
}

export default Basketball;
