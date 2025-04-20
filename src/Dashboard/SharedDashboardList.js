import { Edit, View } from "@carbon/icons-react";
import {
    Button,
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
import axios from "axios";
import { useState } from "react";
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
    }, {
        key: "myAccess",
        header: "Access"
    }
];

const SharedDashboardList = () => {
    const { dashboardsList } = useLoaderData();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

    const filteredRows = dashboardsList
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
                    <TableContainer title="Shared Dashboards">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch onChange={handleSearch} />
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
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
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            {/* <PlaceholderForTable /> */}
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

        </>
    );
};

export const sharedDashboardsLoader = async () => {
    const dashboardsList = await axios.get("/dashboards/shared").then((res) => res.data);
    return { dashboardsList };
}

export default SharedDashboardList;