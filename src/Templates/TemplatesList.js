import { Add } from "@carbon/icons-react";
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
  Modal,
  TextInput,
  Dropdown,
  Pagination,
} from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { customSortRow } from '../Methods/Sort';

const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "board",
    header: "Board",
  },
];

const TemplatesList = () => {
  const navigate = useNavigate();
  const templateData = useLoaderData();
  const [errorMessage, setErrorMessage] = useState('');

  const [open, setOpen] = useState(false);
  const [newBoard, setNewBoard] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");

  const newTemplate = () => {
    axios
      .post(`template`, {
        name: newTemplateName,
        board: newBoard,
      })
      .then((res) => {
        if (res.data.id && res.data.name) {
          setRows((existing) => [res.data, ...existing])
          setOpen(false)
        } else {
          setErrorMessage("Unable to create template")
        }
      }).catch(err => setErrorMessage(`Error creating template: ${err.message}`)) 
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState(null); // Track sort column
  const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

  const [rows, setRows] = useState(templateData);

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


  return (
    <>
      <DataTable rows={paginatedRows} headers={headers} isSortable>
        {() => (
          <TableContainer title="Templates">
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch onChange={handleSearch} />
                <Button renderIcon={Add} onClick={() => setOpen(true)}>
                  New Template
                </Button>
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
              </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => {console.log(row)
                return (
                  <TableRow key={row.id} onClick={() => navigate(`${row.id}/view`)}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.board}</TableCell>
                </TableRow>);})}
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
        open={open}
        id="new-template-modal"
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={() => newTemplate()}
        modalHeading="Create a new template"
        primaryButtonText="Create"
        secondaryButtonText="Cancel"
      >
        <Dropdown
        id="dropdown-board"
          label="Board"
          titleText="Board"
          selectedItem={newBoard}
          onChange={(e) => {
            setNewBoard(e.selectedItem.name);
          }}
          items={[
            {
              id: "one",
              label: "ESP32",
              name: "ESP32",
            },
            {
              id: "two",
              label: "ESP8266",
              name: "ESP8266",
            },
          ]}
          style={{
            marginBottom: "1rem",
          }}
        />

        <TextInput
        id="text-input-template-name"
          labelText="Template name"
          value={newTemplateName}
          onChange={(e) => {
            setNewTemplateName(e.target.value);
          }}
        />
        <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>

      </Modal>
    </>
  );
};

export const templateListLoader = async () => {
  const templates = await axios.get("/templates").then((res) => res.data);
  return templates;
};

export default TemplatesList;
