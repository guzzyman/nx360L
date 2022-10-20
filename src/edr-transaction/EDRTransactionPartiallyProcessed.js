import '@mui/material';
import {RouteEnum} from 'common/Constants';
import EDRTransactionScaffold from './EDRTransactionScaffold';

function EDRTransactionPartiallyProcessed (props) {
  return (
    <EDRTransactionScaffold
      title="Partially Processed"
      breadcrumbs={[{name: 'Partially Processed'}]}
      // columns={columns}
      queryArgs={queryArgs}
      detailsRoutePath={RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS}
    />
  );
}

export default EDRTransactionPartiallyProcessed;

const queryArgs = {status: 'PROCCESSING', withUniqueId: true};

// const columns = [
//   { Header: "Employer", accessor: "payment_id" },
//   { Header: "Staff ID", accessor: "remitted" },
//   { Header: "Employee Count", accessor: "fcmb" },
//   { Header: "Ref ID", accessor: "date" },
//   { Header: "Period", accessor: "period" },
//   { Header: "Deduction Amount", accessor: "amount" },
//   { Header: "Status", accessor: "status" },
// ];
