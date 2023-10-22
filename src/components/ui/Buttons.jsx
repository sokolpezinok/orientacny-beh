import classNames from "classnames";

export const ButtonsWrapper = ({ children, className, ...options }) => {
  return (
    <div className={classNames("flex w-full flex-col gap-y-4 py-4", className)} {...options}>
      {children}
    </div>
  );
};

export const Button = ({ children, primary = false, className, ...options }) => {
  return primary ? (
    <button className={classNames("w-full rounded-xl bg-orange-600 p-4 text-white disabled:opacity-50 dark:bg-orange-700", className)} {...options}>
      {children}
    </button>
  ) : (
    <button className={classNames("w-full rounded-xl bg-gray-300 p-4 text-gray-700 disabled:opacity-50 dark:bg-gray-400", className)} {...options}>
      {children}
    </button>
  );
};
