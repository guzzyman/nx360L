import CDLBlueImg from "assets/images/cdl-logo-blue.png";
import CDLWhiteImg from "assets/images/cdl-logo-white.png";
import clsx from "clsx";

/**
 *
 * @param {{color: 'blue' | 'white'} & import("react").ComponentPropsWithoutRef<'img'>} props
 */
function CreditDirectLogo(props) {
  const { color, className, ...rest } = props;
  const Img = color === "white" ? CDLWhiteImg : CDLBlueImg;
  return (
    <img
      src={Img}
      alt="logo"
      className={clsx("max-w-[200px]", className)}
      {...rest}
    />
  );
}

export default CreditDirectLogo;
