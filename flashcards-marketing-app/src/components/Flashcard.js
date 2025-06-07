import React, { useState } from 'react';
import '../styles/App.css';

export default function Flashcard({ data }) {
  const [show, setShow] = useState(false);

  return (
    <div className={`flashcard${show ? ' show' : ''}`}> 
      <div
        className="flashcard-inner"
        onClick={() => setShow(!show)}
      >
        <div className="flashcard-front">
          <p>{data.question}</p>
        </div>
        <div className="flashcard-back">
          <p>{data.answer}</p>
        </div>
      </div>
    </div>
  );
}