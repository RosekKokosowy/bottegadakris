import React from 'react';

interface IconSVGProps {
  color: string;
  size?: string;
}

export const Mail = ({ color, size }: IconSVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size ?? '18'}
      viewBox="0 0 24 18"
      width={size ?? '24'}
      color={color ?? '#cccccc'}
      fill={'none'}
    >
      <path
        d="M1.5 3.16659C1.5 2.54775 1.74583 1.95425 2.18342 1.51667C2.621 1.07908 3.21449 0.833252 3.83333 0.833252H20.1667C20.7855 0.833252 21.379 1.07908 21.8166 1.51667C22.2542 1.95425 22.5 2.54775 22.5 3.16659M1.5 3.16659V14.8333C1.5 15.4521 1.74583 16.0456 2.18342 16.4832C2.621 16.9208 3.21449 17.1666 3.83333 17.1666H20.1667C20.7855 17.1666 21.379 16.9208 21.8166 16.4832C22.2542 16.0456 22.5 15.4521 22.5 14.8333V3.16659M1.5 3.16659L12 10.1666L22.5 3.16659"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
