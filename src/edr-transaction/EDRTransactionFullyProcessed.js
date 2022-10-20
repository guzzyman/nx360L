import '@mui/material';
import {RouteEnum} from 'common/Constants';
import EDRTransactionScaffold from './EDRTransactionScaffold';

function EDRTransactionFullyProcessed (props) {
  return (
    <EDRTransactionScaffold
      title="Fully Processed"
      breadcrumbs={[{name: 'Fully Processed'}]}
      // columns={columns}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_FULLY_PROCESSED_DETAILS}
    />
  );
}

export default EDRTransactionFullyProcessed;

const queryArgs = {status: 'SUCCESS', withUniqueId: true};

// const columns = [
//   { Header: "Employer", accessor: "payment_id" },
//   { Header: "Staff ID", accessor: "remitted" },
//   { Header: "Employee Count", accessor: "fcmb" },
//   { Header: "Ref ID", accessor: "date" },
//   { Header: "Period", accessor: "period" },
//   { Header: "Deduction Amount", accessor: "amount" },
//   { Header: "Status", accessor: "status" },
// ];
