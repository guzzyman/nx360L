import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import { Link } from "react-router-dom";
import { ReactComponent as FrequentPosting } from "assets/svgs/accounting/frequent-posting.svg";
import { ReactComponent as ChartAccount } from "assets/svgs/accounting/chart-account.svg";
import { ReactComponent as AddJournalEntries } from "assets/svgs/accounting/addJournal-entries.svg";
import { ReactComponent as SearchJournalEntries } from "assets/svgs/accounting/searchJournal-entries.svg";
import { ReactComponent as AccountsLinked } from "assets/svgs/accounting/accounts-linked.svg";
import { ReactComponent as MigrateOpeningBalance } from "assets/svgs/accounting/migrate-opening-balance.svg";
import { ReactComponent as ClosingEntries } from "assets/svgs/accounting/closing-entries.svg";
import { ReactComponent as AccountingRules } from "assets/svgs/accounting/accounting-rules.svg";
import { ReactComponent as Accruals } from "assets/svgs/accounting/accruals.svg";
import { ReactComponent as ProvisioningEntries } from "assets/svgs/accounting/provisioning-entries.svg";
import { Paper, Typography } from "@mui/material";

function Accounting(props) {
  return (
    <>
      <PageHeader
        title="Accounting"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting" },
        ]}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ACCOUNTING_LINKS.map(({ Icon, name, description, path }) => (
          <Paper
            key={name}
            component={Link}
            to={path}
            className="flex flex-col items-center p-4"
          >
            <div className="mb-4">
              <Icon />
            </div>
            <div>
              <Typography variant="h6" className="text-center font-bold">
                {name}
              </Typography>
              <Typography
                className="text-center"
                variant="body2"
                color="textSecondary"
              >
                {description}
              </Typography>
            </div>
          </Paper>
        ))}
      </div>
    </>
  );
}

export default Accounting;

const ACCOUNTING_LINKS = [
  {
    name: "Frequent Posting",
    path: RouteEnum.DASHBOARD,
    Icon: FrequentPosting,
    description: "This are predefined posting",
  },
  {
    name: "Chart Account",
    path: RouteEnum.CHARTOFACCOUNTS,
    Icon: ChartAccount,
    description: "List of the accounts used by the organization",
  },
  {
    name: "Add Journal Entries",
    path: RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_ADD,
    Icon: AddJournalEntries,
    description: "This are predefined posting",
  },
  {
    name: "Search Journal Entries",
    path: RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_SEARCH,
    Icon: SearchJournalEntries,
    description: "Advance search options for journal entries",
  },
  {
    name: "Accounts Linked to Financial Activities",
    path: RouteEnum.DASHBOARD,
    Icon: AccountsLinked,
    description: "Links of financial activities and GL Account Mappings",
  },
  {
    name: "Migrate Opening Balance (Office-Wise)",
    path: RouteEnum.DASHBOARD,
    Icon: MigrateOpeningBalance,
    description: "Links of financial activities and GL Account Mappings",
  },
  {
    name: "Closing Entries",
    path: RouteEnum.DASHBOARD,
    Icon: ClosingEntries,
    description: "Journal entries made at the end",
  },
  {
    name: "Accounting Rules",
    path: RouteEnum.DASHBOARD,
    Icon: AccountingRules,
    description: "List of all accounting rules",
  },
  {
    name: "Accruals",
    path: RouteEnum.DASHBOARD,
    Icon: Accruals,
    description: "Accrual income expenses and liabilities",
  },
  {
    name: "Provisioning Entries",
    path: RouteEnum.DASHBOARD,
    Icon: ProvisioningEntries,
    description: "Create provisioning entries",
  },
];
