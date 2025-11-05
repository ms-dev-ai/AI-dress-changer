
import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3.75 18A5.25 5.25 0 009 20.25h6A5.25 5.25 0 0020.25 15c0-2.342-1.396-4.355-3.375-5.061-1.2-2.426-3.812-4.189-6.875-4.189-3.062 0-5.675 1.763-6.875 4.189A5.234 5.234 0 003.75 15C3.75 16.791 4.909 18 6.562 18"
    />
  </svg>
);
