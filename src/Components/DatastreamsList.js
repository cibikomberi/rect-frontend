import { Add, Edit, TrashCan } from "@carbon/icons-react";
import { Button, DataTable, Dropdown, InlineLoading, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";

const datastreamHeaders = [
  {
    key: "identifier",
    header: "Id",
  },
  {
    key: "name",
    header: "Name",
  },
  {
    key: "type",
    header: "Data type",
  },
  {
    key: "unit",
    header: "Unit",
  },
];
const datastreams = [
  {
    id: "one",
    label: "Integer",
    name: "Integer",
  },
  {
    id: "two",
    label: "Float",
    name: "Float",
  },
  {
    id: "three",
    label: "String",
    name: "String",
  },
]
const DatastreamsList = ({ dataStreams, setDatastreams, deviceId, templateOrDevice, isLocked }) => {

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState('');


  const [datastreamId, setDatastreamId] = useState("");
  const [datastreamName, setDatastreamName] = useState("");
  const [datastreamType, setDatastreamType] = useState("");
  const [datastreamUnit, setDatastreamUnit] = useState("");

  const filteredDataStreams = dataStreams.filter((val) =>
    val.name.includes(searchKeyword)
  );

  const updateDatastream = (datastreamId, datastream) => {
    setStatus('');
    setIsLoading('active');
    axios.put(`/${templateOrDevice}/datastream/${deviceId}/${datastreamId}`, {
      ...datastream,
      deviceId: deviceId
    }).then(res => {
      if (res.data === "ok") {
        setIsLoading('')
        setIsModalOpen('')
        setStatus('')
      } else {
        setStatus(res.data)
        setIsLoading('error')
      }
    })
  }

  const createDatastream = (datastream) => {
    setIsLoading('active');
    setStatus('');
    axios.post(`/${templateOrDevice}/datastream/${deviceId}`, {
      ...datastream,
      deviceId: deviceId
    }).then(res => {
      if (res.data === "ok") {
        setIsLoading('')
        setIsModalOpen('')
        setStatus('')
      } else {
        setStatus(res.data)
        setIsLoading('error')
      }
    })
  }

  const deleteDatastream = (datastreamId) => {
    axios.delete(`/${templateOrDevice}/datastream/${deviceId}/${datastreamId}`)
  }
  

  return (
    <>
      <DataTable rows={dataStreams} headers={datastreamHeaders} isSortable>
        {() => (
          <TableContainer title="Datastreams">
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  value={searchKeyword}
                />
                {!isLocked && <Button renderIcon={Add} onClick={() => {
                  setIsModalOpen('new')
                  setDatastreamId('')
                  setDatastreamName('')
                  setDatastreamType('')
                  setDatastreamUnit('')
                }}>
                  New Datastream
                </Button>}
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Id</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Unit</TableHeader>
                  {!isLocked && <TableHeader>Actions</TableHeader>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDataStreams.map((row) => (
                  <TableRow key={row.identifier}>
                    <TableCell>{row.identifier}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    {!isLocked && <TableCell>
                      <Button
                        onClick={() => {
                          setIsModalOpen(row.identifier)
                          setDatastreamId(row.identifier)
                          setDatastreamName(row.name)
                          setDatastreamType(row.type)
                          setDatastreamUnit(row.unit)
                        }}
                        kind="ghost"
                        renderIcon={Edit}
                        iconDescription="Edit"
                        hasIconOnly
                      />
                      <Button
                        onClick={() => deleteDatastream(row.identifier)}
                        kind="ghost"
                        renderIcon={TrashCan}
                        iconDescription="Delete"
                        hasIconOnly
                        />
                    </TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal
        open={isModalOpen ? true : false}
        onRequestClose={() => setIsModalOpen('')}
        onRequestSubmit={() => isModalOpen === "new" ? createDatastream({
          identifier: datastreamId,
          name: datastreamName,
          type: datastreamType,
          unit: datastreamUnit,
        }, setStatus) : updateDatastream(isModalOpen, {
          identifier: datastreamId,
          name: datastreamName,
          type: datastreamType,
          unit: datastreamUnit,
        }, setStatus)}
        modalHeading={isModalOpen === "new" ? "Create new datastream": "Edit datastream"}
        primaryButtonDisabled={isLoading ? true : false}
        primaryButtonText={
          isLoading ? (
            <InlineLoading
              status={isLoading}
              description={
                isLoading === "active"
                  ? "Creating datastream..."
                  : "Error creating datastream"
              }
              iconDescription={
                isLoading === "active"
                  ? "Creating datastream..."
                  : "Error creating datastream"
              }
            />
          ) : (
            "Create"
          )
        }
        secondaryButtonText="Cancel"
      >
        <TextInput
          id="datastream-id-input"
          labelText="Datastream id"
          value={datastreamId}
          onChange={(e) => {
            setIsLoading('')
            setDatastreamId(e.target.value)
          }}
        />
        <TextInput
          id="datastream-name-input"
          labelText="Name"
          value={datastreamName}
          onChange={(e) => {
            setIsLoading('')
            setDatastreamName(e.target.value)
          }}
        />
        <Dropdown
          id="datastream-type-input"
          label="Data type"
          titleText="Data type"
          value={datastreams.filter((item) => item.name === datastreamType)}
          onChange={(e) => {
            setIsLoading('')
            setDatastreamType(e.selectedItem.name)
          }}
          items={datastreams}
          style={{
            marginBottom: "1rem",
          }}
        />
        <TextInput
          labelText="Unit"
          id="datastream-unit-input"
          value={datastreamUnit}
          onChange={(e) => setDatastreamUnit(e.target.value)}
        />
        <p style={{ color: "red", fontSize: "12px" }}>{status}</p>
      </Modal>
    </>
  );
};

export default DatastreamsList;