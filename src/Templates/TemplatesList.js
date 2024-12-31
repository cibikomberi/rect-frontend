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
} from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

const TemplatesList = () => {
  const navigate = useNavigate();
  const templateData = useLoaderData();
  const [searchKeyword, setSearchKeyword] = useState("");

  const [open, setOpen] = useState(false);
  const [newBoard, setNewBoard] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");

  const newTemplate = () => {
    axios
      .post(`template`, {
        name: newTemplateName,
        board: newBoard,
      })
      .then((res) => setOpen(false));
  };

  const filteredTemplateData = templateData.filter((val) =>
    val.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    val.board.toLowerCase().includes(searchKeyword.toLowerCase())
  );

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

  return (
    <>
      <DataTable rows={filteredTemplateData} headers={headers} isSortable>
        {() => (
          <TableContainer title="Templates">
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  value={searchKeyword}                />
                <Button renderIcon={Add} onClick={() => setOpen(true)}>
                  New Template
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Board</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTemplateData.map((row) => {console.log(row)
                return (
                  <TableRow key={row.id} onClick={() => navigate(`${row.id}/view`)}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.board}</TableCell>
                </TableRow>);})}
              </TableBody>
            </Table>
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
          value={newBoard}
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
      </Modal>
    </>
  );
};

export const templateListLoader = async () => {
  const templates = await axios.get("/templates").then((res) => res.data);
  return templates;
};

export default TemplatesList;
