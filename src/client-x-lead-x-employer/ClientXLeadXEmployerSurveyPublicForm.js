import { Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ClientXLeadXEmployerSurveyForm from "./ClientXLeadXEmployerSurveyForm";
import HeaderBackground from "assets/images/HeaderBackground.png";
import { ReactComponent as CreditDirectWhiteLogo } from "../assets/svgs/CreditDirectLogowhite.svg";
import { nxClientSurveyPublicApi } from "./ClientXLeadXEmployerSurveyStoreQuerySlice";
import { useState } from "react";

function ClientXLeadXEmployerSurveyPublicForm() {
  const { surveyId, userId, clientId } = useParams();
  const [survey, setSurvey] = useState();

  return (
    <div className="h-full" style={{ backgroundColor: "#E4F0F7" }}>
      <Paper elevation={0} className="container mx-auto">
        <div className="relative">
          <div className="flex h-52">
            <img
              src={HeaderBackground}
              alt="headerbackground"
              className="w-full h-full"
            />
            <div className="flex absolute pt-10 right-10">
              <CreditDirectWhiteLogo />
            </div>
            <div className="absolute pt-20 p-10">
              <Typography
                variant="h5"
                className="text-white text-3xl font-bold"
              >
                {survey?.name}
              </Typography>
              <Typography className="text-white">
                {survey?.description}
              </Typography>
            </div>
          </div>
        </div>
        <ClientXLeadXEmployerSurveyForm
          {...{
            onClose: () => {},
            surveyId,
            userId,
            clientId,
            onSurveySelected: setSurvey,
            useGetClientSurveyTemplatesQuery:
              nxClientSurveyPublicApi.useGetClientSurveyTemplatesQuery,
          }}
        />
      </Paper>
    </div>
  );
}

export default ClientXLeadXEmployerSurveyPublicForm;
// /_/survey/1/138/293599
