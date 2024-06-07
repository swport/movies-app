import { forwardRef, ComponentProps } from "react";
import cn from "classnames";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ children, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full py-1.5 px-2 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40",
          className
        )}
        {...rest}
      />
    );
  }
);

export default Input;
