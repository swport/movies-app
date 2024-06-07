import { forwardRef, ComponentProps } from "react";
import cn from "classnames";

type TButtonProps = ComponentProps<"button"> & {
  btnType?: "primary" | "secondary" | "danger";
};

const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  ({ children, className, btnType, ...rest }, ref) => {
    let btnColor = "bg-blue-600 hover:bg-blue-700";
    if (btnType == "secondary") {
      btnColor = "bg-slate-700 hover:bg-slate-800";
    } else if (btnType == "danger") {
      btnColor = "bg-red-600 hover:bg-red-700";
    }

    return (
      <button
        ref={ref}
        className={cn(
          "w-auto flex-none text-white text-md leading-4 font-semibold py-3 px-4 border border-transparent rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-100",
          btnColor,
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
