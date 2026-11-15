import React from 'react';

interface IconSVGProps {
  color: string;
  size?: string;
}

export const Facebook = ({ color, size }: IconSVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size ?? '18'}
      viewBox="0 0 18 18"
      width={size ?? '18'}
      color={color ?? '#cccccc'}
      fill={'none'}
    >
      <path
        d="M17 9.04889C17 4.60361 13.4183 1 9 1C4.58172 1 1 4.60361 1 9.04889C1 13.0663 3.92548 16.3962 7.75 17V11.3755H5.71875V9.04889H7.75V7.27562C7.75 5.25837 8.94434 4.1441 10.7717 4.1441C11.647 4.1441 12.5625 4.3013 12.5625 4.3013V6.28208H11.5537C10.5599 6.28208 10.25 6.90252 10.25 7.53905V9.04889H12.4688L12.1141 11.3755H10.25V17C14.0745 16.3962 17 13.0663 17 9.04889Z"
        stroke={color}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
};
