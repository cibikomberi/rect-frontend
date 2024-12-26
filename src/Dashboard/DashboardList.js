import { Add, Edit, View } from "@carbon/icons-react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TextInput,
  Dropdown,
  Modal,
  InlineLoading,
  FilterableMultiSelect,
} from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";


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

  const [newDashboardDevices, setNewDashboardDevices] = useState([]);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardAccess, setNewDashboardAccess] = useState("Private");
  const newDashboard = () => {
    setIsCreatingDashboard('active');
    axios.post("/dashboard", {
      name: newDashboardName,
      access: newDashboardAccess,
      associatedDevices: newDashboardDevices,
    }).then((response) => {
      setIsDialogOpen(false);
      setIsCreatingDashboard('');
      setNewDashboardName('');
      setNewDashboardAccess('Private');
    }).catch((error) => {
      setIsCreatingDashboard('error');
    });
  }
  console.log(newDashboardDevices);

  return (
    <>
      <DataTable rows={dashboardsList} headers={headers} isSortable>
        {() => (
          <TableContainer title="Dashboards">
            <TableToolbar>
              <TableToolbarContent>
                {/* <TableToolbarSearch onChange={(e) => applySearchFilter(e.target.value)} /> */}
                <Button renderIcon={Add} onClick={() => setIsDialogOpen(true)}> New Dashboard </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Access</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardsList.map((row) => (
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
                        to={`/dashboard/${row.id}`}
                        renderIcon={View}
                        iconDescription="View"
                        hasIconOnly
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          id="access-dropdown"
          label="Access"
          titleText="Access"
          value={newDashboardAccess}
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
          id="datastream-multiselect"
          titleText="Select Devices"
          items={deviceList}
          itemToString={(item) => item.name}
          selectedItems={deviceList.filter((item) => newDashboardDevices.includes(item.id))}
          onChange={(e) => setNewDashboardDevices(e.selectedItems.map((item) => item.id))}
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
      </Modal>
    </>
  );
};

export const dashboardListLoader = async () => {
  const dashboardsList = await axios.get("/dashboards").then((res) => res.data);
  const deviceList = await axios.get('/devices/1').then((res) => res.data)
  return { dashboardsList, deviceList };
}

export default DashboardList;
