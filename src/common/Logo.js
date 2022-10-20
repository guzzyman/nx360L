import { ReactComponent as NimbleX360Svg } from "assets/svgs/nimble-x-360.svg";
import NimbleX360Png from "assets/images/nimble-x-360.png";
import "./Logo.css";
import clsx from "clsx";

/**
 *
 * @param {import("react").ComponentPropsWithoutRef<typeof NimbleX360Svg>} props
 */
function Logo(props) {
  const { className, ...rest } = props;
  // return <NimbleX360Svg {...props } />;
  return (
    <div className={clsx("Logo", className)} {...rest}>
      <img src={NimbleX360Png} alt="NimbleX360" className="w-full h-full" />
    </div>
  );
}

export default Logo;
