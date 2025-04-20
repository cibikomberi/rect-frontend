import { Add, Edit, SettingsEdit, View } from "@carbon/icons-react";
import {
  Button,
  DataTable,
  Dropdown,
  FilterableMultiSelect,
  InlineLoading,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TextInput
} from "@carbon/react";
import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { customSortRow } from '../Methods/Sort';


const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "access",
    header: "Private/Public",
  },
];

const DashboardList = () => {
  const { dashboardsList, deviceList } = useLoaderData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingDashboard, setIsCreatingDashboard] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newDashboardDevices, setNewDashboardDevices] = useState([]);
  const selectedItems = useMemo(
    () => deviceList.filter((item) => newDashboardDevices.includes(item.id)),
    [deviceList, newDashboardDevices]
  );
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardAccess, setNewDashboardAccess] = useState("Private");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState(null); // Track sort column
  const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

  const [rows, setRows] = useState(dashboardsList);

  const filteredRows = rows
          .filter((val) => val.name.toLowerCase().includes(searchKeyword.toLowerCase()))
  
      const sortedRows = sortColumn
          ? [...filteredRows].sort((a, b) =>
              customSortRow(a[sortColumn], b[sortColumn], {
                  sortDirection,
                  sortStates: { ASC: 'ASC', DESC: 'DESC' },
                  locale: navigator.language,
              })
          )
          : filteredRows;
  
      const paginatedRows = sortedRows.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
      );

  const handlePaginationChange = ({ page, pageSize }) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  const handleSort = (headerKey) => {
    if (sortColumn === headerKey) {
      setSortDirection((prev) =>
        prev === 'ASC' ? 'DESC' : prev === 'DESC' ? 'NONE' : 'ASC'
      );
    } else {
      setSortColumn(headerKey);
      setSortDirection('ASC');
    }
  };
  const newDashboard = () => {
    setIsCreatingDashboard('active');
    axios.post("/dashboard", {
      name: newDashboardName,
      access: newDashboardAccess,
      associatedDevices: newDashboardDevices,
    }).then((res) => {
      if (res.data.id && res.data.name) {
        setRows((existing) => [res.data, ...existing])
        setIsDialogOpen(false);
        setIsCreatingDashboard('');
        setNewDashboardName('');
        setNewDashboardAccess('Private');
      } else {
        setErrorMessage("Unable to create template")
      }
    }).catch((err) => {
      setErrorMessage(`Error creating template: ${err.message}`)
      setIsCreatingDashboard('error');
    });
  }
  console.log(newDashboardDevices);

  return (
    <>
      <DataTable rows={paginatedRows} headers={headers} isSortable>
        {() => (
          <TableContainer title="Dashboards">
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch onChange={handleSearch} />
                <Button renderIcon={Add} onClick={() => setIsDialogOpen(true)}> New Dashboard </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.header}
                      isSortHeader={sortColumn === header.key}
                      sortDirection={sortDirection}
                      onClick={() => handleSort(header.key)}
                      isSortable>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.access}</TableCell>
                    <TableCell>
                      <Button
                        kind="ghost"
                        as={Link}
                        to={`/dashboard/${row.id}/edit`}
                        renderIcon={Edit}
                        iconDescription="Edit"
                        hasIconOnly
                      />
                      <Button
                        kind="ghost"
                        as={Link}
                        to={`/dashboard/${row.id}/view`}
                        renderIcon={View}
                        iconDescription="View"
                        hasIconOnly
                      /><Button
                        kind="ghost"
                        to={`/dashboard/${row.id}/view`}
                        renderIcon={SettingsEdit}
                        iconDescription="Configure"
                        hasIconOnly
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              totalItems={filteredRows.length}
              onChange={handlePaginationChange}
            />
          </TableContainer>
        )}
      </DataTable>
      <Modal
        open={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
        onRequestSubmit={() => newDashboard()}
        modalHeading="Create a new dashboard"
        primaryButtonDisabled={isCreatingDashboard ? true : false}
        primaryButtonText={
          isCreatingDashboard ? (
            <InlineLoading
              status={isCreatingDashboard}
              description={
                isCreatingDashboard === "active"
                  ? "Creating dashboard..."
                  : "Error creating dashboard"
              }
              iconDescription={
                isCreatingDashboard === "active"
                  ? "Creating dashboard..."
                  : "Error creating dashboard"
              }
            />
          ) : (
            "Create"
          )
        }
        secondaryButtonText="Cancel"
      >
        <Dropdown
        autoAlign
          id="access-dropdown"
          label="Access"
          titleText="Access"
          selectedItem={newDashboardAccess}
          onChange={(e) => {
            setIsCreatingDashboard("");
            setNewDashboardAccess(e.selectedItem.name);
          }}
          items={[
            {
              id: "one",
              label: "Public",
              name: "Public",
            },
            {
              id: "two",
              label: "Private",
              name: "Private",
            },
          ]}
          style={{
            marginBottom: "1rem",
          }}
        />
        <FilterableMultiSelect
          autoAlign
          id="datastream-multiselect"
          titleText="Select Devices"
          items={deviceList}
          itemToString={(item) => item.name}
          selectedItems={deviceList.filter((item) => newDashboardDevices.includes(item.id))}
          onChange={(e) => {
            const newSelectedIds = e.selectedItems.map((item) => item.id);
            if (JSON.stringify(newSelectedIds) !== JSON.stringify(newDashboardDevices)) {
              setNewDashboardDevices(newSelectedIds);
            }
          }}
          selectionFeedback="top-after-reopen"
        />
        <TextInput
          id="name-input"
          labelText="Dashboard name"
          value={newDashboardName}
          onChange={(e) => {
            setIsCreatingDashboard("");
            setNewDashboardName(e.target.value);
          }}
        />
        <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
      </Modal>
    </>
  );
};

export const dashboardListLoader = async () => {
  const dashboardsList = await axios.get("/dashboards").then((res) => res.data);
  const devices = await axios.get('/devices').then((res) => res.data)
  const sharedDevices = await axios.get('/devices/shared').then((res) => res.data)
  return { dashboardsList, deviceList: [...devices, ...sharedDevices] };
}

export default DashboardList;
