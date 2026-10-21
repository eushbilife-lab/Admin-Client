import NoResult from "../NoResult";
import Table from "@mui/material/Table";
import TableLoader from "../TableLoader";
import { TableLoadingWrapperProps } from ".";

/**
 * Initial load → table skeleton.
 * Empty → NoResult.
 * Has rows → children (use TableWrapper `refreshing` for soft refetch overlay).
 */
export default function TableLoadingWrapper({
  length,
  loading,
  children,
  container,
  rows = 8,
  coloumns = 5,
  message = "No result found",
}: TableLoadingWrapperProps) {
  const rowCount = Number(length) || 0;
  const initialLoad = Boolean(loading) && rowCount === 0;

  if (initialLoad) {
    const skeleton = (
      <TableLoader rows={rows} coloumns={coloumns} showHeader />
    );
    return container ? <Table>{skeleton}</Table> : <>{skeleton}</>;
  }

  if (rowCount === 0) {
    const empty = <NoResult message={message} />;
    return container ? <Table>{empty}</Table> : <>{empty}</>;
  }

  return <>{children}</>;
}
