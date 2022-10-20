import { useState } from "react";
import {} from "@mui/material";
import useToggle from "hooks/useToggle";
import ClientXLeadXEmployerSurveyForm from "./ClientXLeadXEmployerSurveyForm";
import ClientXLeadXEmployerSurveyList from "./ClientXLeadXEmployerSurveyList";
import ClientXLeadXEmployerSurveyPreview from "./ClientXLeadXEmployerSurveyPreview";
import useAuthUser from "hooks/useAuthUser";

function ClientXLeadXEmployerSurvey(props) {
  const { client } = props;
  const authUser = useAuthUser();
  const [isSurveyForm, toggleSurveyForm] = useToggle();
  const [surveyPreviewId, setSurveyPreviewId] = useState(-1);


  const contentProps = {
    client,
    isSurveyForm,
    toggleSurveyForm,
    surveyPreviewId,
    setSurveyPreviewId,
  };

  if (isSurveyForm) {
    return (
      <ClientXLeadXEmployerSurveyForm
        {...{
          onClose: toggleSurveyForm,
          userId: authUser?.id,
          clientId: client?.clients?.id,
        }}
      />
    );
  }

  if (surveyPreviewId > -1) {
    return <ClientXLeadXEmployerSurveyPreview {...contentProps} />;
  }

  return <ClientXLeadXEmployerSurveyList {...contentProps} />;
}

export default ClientXLeadXEmployerSurvey;
