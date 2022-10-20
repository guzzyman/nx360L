import { Link, Typography } from "@mui/material";
import CreditDirectLogo from "common/CreditDirectLogo";

function CreditDirectPayFooter(props) {
  return (
    <div className="flex items-center justify-between my-2">
      <div>
        <Typography variant="caption">Powered by</Typography>
        <CreditDirectLogo className="w-24" />
      </div>
      <div>
        <Typography variant="caption" className="block">
          Having challenges? Contact the Support Team
        </Typography>
        <Typography variant="caption" className="block">
          <Link href="tel:014482225">014482225</Link> or{" "}
          <Link href="mailto:resolutionsteam@creditdirect.ng">
            resolutionsteam@creditdirect.ng
          </Link>
        </Typography>
      </div>
    </div>
  );
}

export default CreditDirectPayFooter;
