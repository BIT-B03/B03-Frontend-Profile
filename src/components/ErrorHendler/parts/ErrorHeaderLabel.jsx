import React from 'react';
import { sanitizeText } from '../../../utils/errorState';

export default function ErrorHeaderLabel({ terminalTitle }) {
  return (
    <div className="text-xs text-muted-gray font-mono mb-4 sm:mb-0 sm:absolute sm:left-7 sm:top-5">
      {sanitizeText(terminalTitle, { maxLen: 40 })}
    </div>
  );
}
