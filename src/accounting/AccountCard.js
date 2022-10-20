import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function AccountCard({ accountlink, classes }) {
  const Icon = accountlink.icon;

  return (
    <div>
      <Card elevation={0} className="rounded-xl p-8">
        <CardContent className="flex items-center gap-4">
          <div>
            <Icon />
            <Typography variant={"h6"} className="text-center font-bold">
              {accountlink.name}
            </Typography>
            <Typography
              className="text-center"
              variant="body2"
              color="textSecondary"
            >
              {accountlink.description}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
