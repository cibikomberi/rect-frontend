import { DataTable, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch } from '@carbon/react';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { customSortRow } from '../Methods/Sort';
import axios from 'axios';

const headers = [
    {
        key: "name",
        header: "Name",
    },
    {
        key: "board",
        header: "Board",
    },
    {
        key: "status",
        header: "Status",
    },{
        key: "myAccess",
        header: "Access"
    }
];

const SharedDevicesList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction

    const navigate = useNavigate();
    const { sharedDevices } = useLoaderData();

    const filteredRows = sharedDevices
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

    const handlePaginationChange = ({ page, pageSize }) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };


    return (
        <>
            <DataTable rows={paginatedRows} headers={headers} isSortable>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Shared Devices">
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch onChange={handleSearch} />
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({ header })}
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
                                {rows.map((row) => (
                                    <TableRow {...getRowProps({ row })} onClick={() => navigate(`/devices/${row.id}/view`)}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}

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
        </>
    );
} 

export const sharedDevicesLoader = async () => {
    const sharedDevices = await axios.get("/devices/shared").then((res) => res.data);
    const time = await axios.get(`/time`).then((res) => res.data)
    return { sharedDevices, time };
}
export default SharedDevicesList;