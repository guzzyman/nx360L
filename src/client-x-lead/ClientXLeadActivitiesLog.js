import React, { useMemo, useState } from "react";
import Modal from "common/Modal";
import {
  Button,
  Icon,
  Typography,
  List,
  ListItem,
  TextField,
  MenuItem,
  Paper,
} from "@mui/material";
import { ReactComponent as ActivityDesktopSvg } from "assets/svgs/crm-client-details-activity-desktop.svg";
import { ReactComponent as ActivityMobileSvg } from "assets/svgs/crm-client-details-activity-mobile.svg";

import LoadingContent from "common/LoadingContent";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { formatDistanceToNow, format } from "date-fns";

export default function ClientXLeadActivitiesLog(props) {
  const { onClose, customerId, ...rest } = props;
  const [channelId, setChannelId] = useState();

  const { data: channelActivitiesList } =
    nimbleX360Api.useGetCodeValuesQuery(46);

  const clientTrackingQueryResult =
    nimbleX360CRMClientApi.useGetClientTrackingQuery(
      useMemo(
        () => ({
          accountNumber: customerId,
          limit: 50,
          ...(channelId && { channelId: channelId }),
        }),
        [customerId, channelId]
      ),
      { skip: !customerId }
    );

  return (
    <Paper className="mt-4 p-4">
      <div className="mb-5 flex justify-right">
        <TextField
          select
          value={channelId || ""}
          label="Filter by Channel"
          sx={{ width: 250 }}
        >
          {channelActivitiesList
            ?.filter((el) => {
              return el.id === 57 || el.id === 58;
            })
            ?.map((option, i) => (
              <MenuItem
                key={i}
                value={option.id}
                onClick={() => setChannelId(option.id)}
              >
                {option.name}
              </MenuItem>
            ))}
        </TextField>
      </div>

      <LoadingContent
        loading={clientTrackingQueryResult?.isLoading}
        error={clientTrackingQueryResult?.isError}
        onReload={clientTrackingQueryResult?.refetch}
      >
        {() => (
          <>
            <List>
              {clientTrackingQueryResult?.data?.pageItems?.map((item, i) => (
                <ListItem
                  disableGutters
                  className="items-center flex-wrap gap-3"
                  key={i}
                >
                  {item?.activationChannelId === 58 ? (
                    <ActivityDesktopSvg />
                  ) : (
                    <ActivityMobileSvg />
                  )}

                  <div className="flex-1 flex flex-wrap">
                    <Typography>
                      Logged In the {item?.activationChannel}
                    </Typography>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <Typography>
                        {/* {formatDistanceToNow(item?.createdDate)} */}
                        {format(new Date(item?.createdDate), "PPpp")} - (
                        {formatDistanceToNow(new Date(item?.createdDate))} ago)
                      </Typography>
                      <Icon className="text-primary-main">alarm</Icon>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </LoadingContent>
    </Paper>
  );
}
