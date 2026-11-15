import { ButtonHTMLAttributes } from "react";

/** The site's outlined button (old `Main/FormElement/Button`). */
export function Button({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${className} border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out`}
    >
      {children}
    </button>
  );
}
