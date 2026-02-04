import React from 'react';
import { sanitizeText } from '../../../utils/errorState';

export default function ErrorStatusBlock({ bigStatus }) {
  return (
    <div className="w-full lg:w-[42%] flex items-center justify-center lg:self-stretch">
      <div className="text-center lg:text-left">
        <div className="text-[84px] sm:text-[128px] font-extrabold tracking-tight leading-none text-brand-24e1c9">
          {sanitizeText(String(bigStatus), { maxLen: 6 })}
        </div>
      </div>
    </div>
  );
}
