import { useMemo } from "react";
import { Button, Link, Typography } from "@mui/material";
import { ReactComponent as DownloadOnAppStoreSvg } from "assets/svgs/download-on-appstore.svg";
import { ReactComponent as GetItOnGooglePlaySvg } from "assets/svgs/get-it-on-google-play.svg";
import useCountdown from "hooks/useCountdown";
import { CreditDirectPayEventEnum } from "./CreditDirectPayConstant";
import * as dfn from "date-fns";

function CreditDirectPayRedirectButtons({
  urlQueryParams,
  isInline,
  sendEvent,
  state,
}) {
  const countdownDate = useMemo(
    () => dfn.addSeconds(new Date(), parseInt(urlQueryParams.timeout) || 10),
    [urlQueryParams.timeout]
  );

  const countdown = useCountdown(countdownDate, {
    onComplete: returnToMerchantSite,
  });

  const href = (
    urlQueryParams.redirectUrl && typeof urlQueryParams.redirectUrl === "string"
      ? urlQueryParams.redirectUrl
      : "https://www.creditdirect.ng"
  ).concat(`?TransactionReference=${"hello"}`);

  function returnToMerchantSite(e) {
    e?.preventDefault?.();
    sendEvent(CreditDirectPayEventEnum.SUCCESS, { message: state?.message });
  }

  return (
    <div>
      <>
        <div className="flex items-center justify-center">
          <Button
            endIcon={
              isInline && !!parseInt(urlQueryParams.timeout) ? (
                <Typography
                  color="inherit"
                  className="font-bold"
                  style={{ fontSize: "inherit" }}
                >
                  {countdown.minutes}:
                  {countdown.seconds < 10
                    ? `0${countdown.seconds}`
                    : countdown.seconds}
                </Typography>
              ) : undefined
            }
            component={Link}
            className="font-bold"
            size="large"
            {...(isInline
              ? {
                  className: "cursor-pointer",
                  onClick: returnToMerchantSite,
                }
              : {
                  href,
                  target: "_blank",
                })}
          >
            Return to Application
          </Button>
        </div>
        {/* <Typography
          className="text-center block"
          variant="caption"
          gutterBottom
        >
          OR
        </Typography> */}
      </>
      {/* <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link
          href="https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.Slack"
          target="_blank"
        >
          <GetItOnGooglePlaySvg />
        </Link>
        <Link
          href="https://apps.apple.com/app/slack-team-communication/id618783545"
          target="_blank"
        >
          <DownloadOnAppStoreSvg />
        </Link>
      </div> */}
      <Typography
        variant="body2"
        className="my-4 text-center text-primary-dark"
      >
        For more information contact us on <b>014482225</b> Or{" "}
        <b>resolutionsteam@creditdirect.ng</b>
      </Typography>
    </div>
  );
}

export default CreditDirectPayRedirectButtons;
