// FAQItem.tsx
import React, { useState } from 'react';

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="faq-item"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`faq-question ${isOpen ? 'open' : ''}`}>
        <span className={`faq-text ${isOpen ? 'highlight' : ''}`}>{question}</span>
        <span className={`faq-icon ${isOpen ? 'rotate highlight' : ''}`}>▲</span>
      </div>

      {isOpen && (
        <div className="faq-answer">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
