import React, { useState } from 'react';
import '../styles/App.css';

export default function Flashcard({ data, onDelete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flashcard" onClick={() => setShow(!show)}>
      <p>{show ? data.answer : data.question}</p>
      {onDelete && <button className="delete" onClick={e => { e.stopPropagation(); onDelete(); }}>🗑️</button>}
    </div>
  );
}