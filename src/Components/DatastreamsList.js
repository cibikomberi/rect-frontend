import { Add, Edit, TrashCan } from "@carbon/icons-react";
import { Button, DataTable, Dropdown, InlineLoading, Modal, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch, TextInput } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { customSortRow } from '../Methods/Sort';

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
const DatastreamsList = ({ dataStreams, setDatastreams, templateOrDeviceId, templateOrDevice, isLocked }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState('');
  // const [dataStreams, setDatastreams] = useState(data);

  const [datastreamId, setDatastreamId] = useState("");
  const [datastreamName, setDatastreamName] = useState("");
  const [datastreamType, setDatastreamType] = useState(datastreams[0]);
  const [datastreamUnit, setDatastreamUnit] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState(null); // Track sort column
  const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

  console.log(dataStreams);
  
  const filteredRows = dataStreams
    .filter((val) => val.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    .map((val) => ({
      ...val,
      id: val.identifier
    }));

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


  const updateDatastream = (datastreamId, datastream) => {
    setStatus('');
    setIsLoading('active');
    axios.put(`/${templateOrDevice}/datastream/${templateOrDeviceId}/${datastreamId}`, {
      ...datastream,
      [`${templateOrDevice}Id`]: templateOrDeviceId
    }).then(res => {
      if (res.data.identifier && res.data.name) {
        setDatastreams((existing) => [res.data, ...existing.filter(rows => rows.identifier !== datastreamId)])
        setIsLoading('')
        setIsModalOpen('')
        setStatus('')
      } else {
        setStatus(res.data)
        setIsLoading('error')
      }
    }).catch(() => {
      setStatus('')
      setIsLoading('error')
      
    })
  }

  const createDatastream = (datastream) => {
    setIsLoading('active');
    setStatus('');
    axios.post(`/${templateOrDevice}/datastream/${templateOrDeviceId}`, {
      ...datastream,
      [`${templateOrDevice}Id`]: templateOrDeviceId
    }).then(res => {
      if (res.data.identifier && res.data.name) {
        setDatastreams((existing) => [res.data, ...existing])
        setIsLoading('')
        setIsModalOpen('')
        setStatus('')
      } else {
        setStatus(res.data)
        setIsLoading('error')
      }
    }).catch(() => {
      setStatus('')
      setIsLoading('error')
      
    })
  }

  const deleteDatastream = (datastreamId) => {
    axios.delete(`/${templateOrDevice}/datastream/${templateOrDeviceId}/${datastreamId}`)
      .then(res => {
        if (res.data === "ok") {
          setDatastreams(existing => existing.filter(rows => rows.identifier !== datastreamId))
        }
      })
  }

  return (
    <>
      <DataTable rows={paginatedRows} headers={datastreamHeaders} isSortable>
        {() => (
          <TableContainer title="Datastreams">
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch onChange={handleSearch} />
                {isLocked && <Button renderIcon={Add} onClick={() => {
                  setIsModalOpen('new')
                  setDatastreamId('')
                  setDatastreamName('')
                  setDatastreamType(datastreams[0])
                  setDatastreamUnit('')
                }}>
                  New Datastream
                </Button>}
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  {datastreamHeaders.map((header) => (
                    <TableHeader
                    key={header.header}
                      isSortHeader={sortColumn === header.key}
                      sortDirection={sortDirection}
                      onClick={() => handleSort(header.key)}
                      isSortable>
                      {header.header}
                    </TableHeader>
                  ))}
                  {isLocked && <TableHeader>Actions</TableHeader>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row.identifier}>
                    <TableCell>{row.identifier}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    {isLocked && <TableCell>
                      <Button
                        onClick={() => {
                          setIsModalOpen(row.identifier)
                          setDatastreamId(row.identifier)
                          setDatastreamName(row.name)
                          setDatastreamType(row.type === "Float" ? datastreams[0] : datastreams[1])
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
        open={isModalOpen ? true : false}
        onRequestClose={() => setIsModalOpen('')}
        onRequestSubmit={() => isModalOpen === "new" ? createDatastream({
          identifier: datastreamId,
          name: datastreamName,
          type: datastreamType.name,
          unit: datastreamUnit,
        }) : updateDatastream(isModalOpen, {
          identifier: datastreamId,
          name: datastreamName,
          type: datastreamType.name,
          unit: datastreamUnit,
        })}
        modalHeading={isModalOpen === "new" ? "Create new datastream" : "Edit datastream"}
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
          invalid={isModalOpen === "new" && dataStreams.some(item => item.identifier === datastreamId)}
          invalidText={'Id already exists'}
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
          selectedItem={datastreamType}
          onChange={(e) => {
            setIsLoading('')
            setDatastreamType(e.selectedItem)
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