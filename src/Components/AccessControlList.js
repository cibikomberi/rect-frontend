import { Share, TrashCan } from "@carbon/icons-react";
import { Button, ComboBox, DataTable, Dropdown, Modal, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableToolbar, TableToolbarContent, TableToolbarSearch } from "@carbon/react";
import axios from "axios";
import { useEffect, useState } from "react";
import bg from "./../Assets/bg.jpeg";
import { customSortRow } from '../Methods/Sort';


const accessControlHeaders = [
    {
        key: 'name',
        header: 'Name',
    },
    {
        key: 'email',
        header: 'Email',
    }
    ,
    {
        key: 'access',
        header: 'Access Level',
    }
];
const accessControlItems = [{
    id: 'one',
    label: 'Editor',
    name: 'Editor'
}, {
    id: 'three',
    label: 'Viewer',
    name: 'Viewer'
}, {
    id: 'four',
    label: 'None',
    name: 'None'
}]
const AccessControlList = ({ accessControls, setAccessControls, templateOrDeviceId, templateOrDevice, isLocked }) => {
    const [searchPeople, setSearchPeople] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [a, setA] = useState([]);
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState([]);
    const [accessControlLevel, setAccessControlLevel] = useState(accessControlItems[0]);


    // const filteredAccessControls = accessControls.filter((val) => val.name.includes(searchKeyword));
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Track sort column
    const [sortDirection, setSortDirection] = useState('NONE'); // Track sort direction


    console.log(user);
    console.log(accessControlLevel);
    const addNewAccesscontrol = () => {
        axios.post(`/${templateOrDevice}/userAccess/${templateOrDeviceId}`, {
            user: user.id,
            access: accessControlLevel.name
        }).then(res => {
            if (res.status === 200) {
                setAccessControls((existing) => ({ ...existing, [user.id]: accessControlLevel.name }))
                setIsModalOpen(false)
                setAccessControlLevel('')
            }
        })
    }

    const removeAccessControl = (userId) => {
        axios.delete(`/${templateOrDevice}/userAccess/${templateOrDeviceId}/${userId}`).then(res => {
            setAccessControls((existing) => {
                var newData = { ...existing };
                delete newData[userId];
                return newData;
            });
            setA((existing) => existing.filter((item) => item.id !== userId))
        })
    }

    useEffect(() => {
        Object.keys(accessControls).forEach((key) => {
            axios.get(`/whoisthis/${key}`).then(function (res) {
                setA(existing => {
                    return [...existing.filter((item) => item.id !== key), {
                        id: key,
                        name: res.data.name,
                        email: res.data.email,
                        access: accessControls[key]
                    }]
                });
                // accessControls[key].name = res.data.name;
            });
        })
    }, [accessControls])


    useEffect(() => {
        if (searchPeople.length > 2) {
            const ourRequest = axios.CancelToken.source() // <-- 1st step

            axios.get(`/friends?param=${searchPeople}`, {
                cancelToken: ourRequest.token,
            }).then(function (res) {
                setPeople(res.data);
            });
            return () => {
                ourRequest.cancel()
            }
        }
    }, [searchPeople])

    const filteredRows = a
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
        <DataTable rows={paginatedRows} headers={accessControlHeaders} isSortable>
            {({ getTableProps }) => (
                <TableContainer title="Access control">
                    <TableToolbar>
                        <TableToolbarContent>
                            <TableToolbarSearch onChange={handleSearch} />
                            {isLocked && <Button label="Remove Access" renderIcon={Share} onClick={() => setIsModalOpen(true)}>Share</Button>}                        </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                        <TableHead>
                            <TableRow>
                                {accessControlHeaders.map((header) => (
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
                            {a.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.access}</TableCell>
                                    {isLocked && <TableCell>
                                        <Button kind="ghost" renderIcon={TrashCan} iconDescription="Remove access" hasIconOnly onClick={() => removeAccessControl(row.id)} />
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



        <Modal open={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onRequestSubmit={() => addNewAccesscontrol()}
            modalHeading="Share"
            primaryButtonText="Share"
            secondaryButtonText="Cancel"
            hasScrollingContent={false}
        >
            <ComboBox
                autoAlign
                id="carbon-combobox"
                items={people}
                value={user?.name || user?.dummyName || ''}
                onChange={(e) => {
                    console.log(e);

                    setUser(e.selectedItem)
                }}
                itemToElement={(item) =>
                    <div style={{ height: "60px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <img src={item.imageId ? `${process.env.REACT_APP_BACKEND_URL}/profile/image/${item.imageId}` : bg} style={{ height: "50px", width: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "15px" }} alt="profile pic" />
                        {item.name} <br />
                        {item.email}
                    </div>
                }
                titleText="Email"
                onInputChange={(e) => {
                    setSearchPeople(e);
                    setUser(existing => ({ ...existing, dummyName: e }));
                }}
                className="custom-combobox"
            />
            <Dropdown
                autoAlign
                id="datastream-type-input"
                label="Access"
                titleText="Access"
                selectedItem={accessControlLevel}
                onChange={(e) => setAccessControlLevel(e.selectedItem)}
                items={accessControlItems}
                style={{
                    marginBottom: '1rem'
                }} />
        </Modal>
    </>
    )
}

export default AccessControlList;