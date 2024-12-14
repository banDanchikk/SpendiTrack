import React, { useState } from 'react';
import '../index.css';

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h2>{title}</h2>
        <span>{isOpen ? '∨' : '>'}</span>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
}
