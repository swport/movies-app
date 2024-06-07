import { forwardRef, ComponentProps } from "react";
import cn from "classnames";

const Select = forwardRef<HTMLSelectElement, ComponentProps<"select">>(
  ({ children, className, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          className
        )}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

export default Select;
