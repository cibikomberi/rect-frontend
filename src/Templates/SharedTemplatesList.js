import {
    DataTable,
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
    TableToolbarSearch
} from "@carbon/react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { customSortRow } from '../Methods/Sort';
import axios from "axios";

const headers = [
    {
        key: "name",
        header: "Name",
    },
    {
        key: "board",
        header: "Board",
    }, {
        key: "myAccess",
        header: "Access"
    }
];

const SharedTemplatesList = () => {
    const navigate = useNavigate();
    const { sharedTemplates } = useLoaderData();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction


    const filteredRows = sharedTemplates
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
    return (<>
        <DataTable rows={paginatedRows} headers={headers} isSortable>
            {() => (
                <TableContainer title="Shared Templates">
                    <TableToolbar>
                        <TableToolbarContent>
                            <TableToolbarSearch onChange={handleSearch} />
                        </TableToolbarContent>
                    </TableToolbar>
                    <Table>
                        <TableHead>
                            {headers.map((header) => (
                                <TableHeader
                                    isSortHeader={sortColumn === header.key}
                                    sortDirection={sortDirection}
                                    onClick={() => handleSort(header.key)}
                                    isSortable>
                                    {header.header}
                                </TableHeader>
                            ))}
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row) => {
                                console.log(row)
                                return (
                                    <TableRow key={row.id} onClick={() => navigate(`/templates/${row.id}/view`)}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.board}</TableCell>
                                        <TableCell>{row.myAccess}</TableCell>
                                    </TableRow>);
                            })}
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
    </>);
}

export const sharedTemplatesLoader = async () => {
    const sharedTemplates = await axios.get("/templates/shared").then((res) => res.data);
    return { sharedTemplates };
}

export default SharedTemplatesList;