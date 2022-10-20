import clsx from "clsx";

/**
 *
 * @param {PageScaffoldProps} props
 */
function PageScaffold(props) {
  const { title, className, header, children, ...rest } = props;
  return (
    <div className={clsx("", className)} {...rest}>
      {children}
    </div>
  );
}

PageScaffold.defaultProps = {
  breadcrumbs: [],
};

export default PageScaffold;

/**
 * @typedef {{
 * header: import("react").ReactNode;
 * } & import("./PageHeader").PageHeaderProps & import("react").ComponentPropsWithoutRef<'div'>} PageScaffoldProps
 */
