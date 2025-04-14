import React from 'react';
import FAQItem from './FAQItem';
import { faqs } from './faqData';

const FAQ: React.FC = () => {
  return (
    <div style={{ width: '70%', margin: '0 auto' }}>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQ;
