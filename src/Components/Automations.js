import { Add, Edit, TrashCan } from "@carbon/icons-react";
import { Button, DataTable, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch } from "@carbon/react";
import { useState } from "react";
import { customSortRow } from "../Methods/Sort";
import AutomationItem from "./AutomationItem";

const automationHeaders = [
    {
        key: "name",
        header: "Name",
    },
    {
        key: "type",
        header: "Automation type",
    }]

const Automations = ({ automations, datastreams }) => {
    const [automationsList, setAutomationsList] = useState(automations);
    const [createAutomation, setCreateAutomation] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

    const filteredRows = automationsList
        .filter((val) => val.name.toLowerCase().includes(searchKeyword.toLowerCase()))
        .map((val) => ({
            ...val,
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
    return (<>
        {createAutomation && <AutomationItem setCreateAutomation={setCreateAutomation} automationsList={automationsList} setAutomationsList={setAutomationsList} datastreams={datastreams} />}
            {!createAutomation && 
                    <DataTable rows={paginatedRows} headers={automationHeaders} isSortable>
                        {() => (
                            <TableContainer title="Automations">
                                <TableToolbar>
                                    <TableToolbarContent>
                                        <TableToolbarSearch onChange={handleSearch} />
                                        {<Button renderIcon={Add} onClick={() => setCreateAutomation(true)}>
                                    New Automation
                                        </Button>}
                                    </TableToolbarContent>
                                </TableToolbar>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {automationHeaders.map((header) => (
                                                <TableHeader
                                                    isSortHeader={sortColumn === header.key}
                                                    sortDirection={sortDirection}
                                                    onClick={() => handleSort(header.key)}
                                                    isSortable>
                                                    {header.header}
                                                </TableHeader>
                                            ))}
                                            <TableHeader>Value</TableHeader>
                                            <TableHeader>Actions</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                {row.type === 'schedule' && <TableCell>{`${row.time} => ${row.datastream.name} (${row.value})`}</TableCell>}
                                                {row.type === 'state' && <TableCell>{`${row.datastream.name} => ${row.targetDevice.name} [${row.targetDatastream.name}]`}</TableCell>}
                                                {row.type === 'email-status' && <TableCell>{`[${row.status[0]}, ...]`}</TableCell>}
                                                {row.type === 'email-value' && <TableCell>{`${row.datastream.name}`}</TableCell>}
                                                <TableCell>
                                                    <Button
                                                        onClick={() => {

                                                        }}
                                                        kind="ghost"
                                                        renderIcon={Edit}
                                                        iconDescription="Edit"
                                                        hasIconOnly
                                                    />
                                                    <Button
                                                        kind="ghost"
                                                        renderIcon={TrashCan}
                                                        iconDescription="Delete"
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
                    </DataTable>}

            {/* </ContainedList>} */}
    </>);
}

export default Automations;