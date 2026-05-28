import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { removeDashboardLink, getAllDashboardAdmin } from 'src/apis/dashboardAdmin';

import { showAlert } from 'src/components/alert';
import { ModalManager } from 'src/components/modal';
import { useModal, ButtonGroup } from 'src/components/button';
// import { Iconify } from 'src/components/iconify';
import { headLabelDashboadAdmin } from 'src/components/Item/item';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { EditLink } from '../editLink';
import { CreateLink } from '../createLink';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { DashboardTableHead } from '../dashboard-table-head';
import { DahsboardAdminTableToolbar } from '../dashboard-table-toolbar';
import { emptyRows, getComparator, applyFilterDashboardAmin } from '../units';
import { DashboardTableRow, type DashboardProps } from '../dashboard-table-row';

// ----------------------------------------------------------------------

export function AdminView() {
  const queryClient = useQueryClient();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { data,open, closeModal, openModal } = useModal();


  const { data: dataDashboardAdmin = [] } = useQuery<DashboardProps[]>({
    queryKey: ['dataDashboardAdmin'],
    queryFn: getAllDashboardAdmin,
  });

  const dataFiltered: DashboardProps[] = applyFilterDashboardAmin({
    inputData: dataDashboardAdmin,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleRemove = () => {
    Swal.fire({
      title: 'Bạn có chắc sẽ xoá Link này',
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Xác nhận',
    }).then((result) => {
      if (result.isConfirmed) {
        table.selected.forEach((selectId) => {
          handleDelete(selectId);
        });
        table.onSelectAllRows(false, []);
      }
    });
  };

  const { mutate: handleDelete } = useMutation<void, Error, string>({
    mutationFn: (linkId) => removeDashboardLink(linkId),
    onError: () => {
      showAlert({ type: 'error', message: 'Link này không tồn tại hoặc đã được xoá' });
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Xoá thành công' });
      queryClient.invalidateQueries({
        queryKey: ['dataDashboardAdmin'],
      });
    },
  });

  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý báo cáo"
        action={<ButtonGroup handleOpen={() => openModal('createLink')} />}
      />
      <PrimaryTemp
        toolbar={
          <DahsboardAdminTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
            delDashboardAdmin={handleRemove}
          />
        }
        head={
          <DashboardTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={dataFiltered.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((u) => u.id)
              )
            }
            headLabel={headLabelDashboadAdmin}
          />
        }
        pagination={{
          page: table.page,
          count: dataFiltered.length,
          rowsPerPage: table.rowsPerPage,
          onPageChange: table.onChangePage,
          onRowsPerPageChange: table.onChangeRowsPerPage,
        }}
      >
        {dataFiltered
          .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
          .map((row) => (
            <DashboardTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
              onEditRow={() => openModal('editLink', row)}
            />
          ))}

        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />
        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>
      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'createLink' && <CreateLink handleClose={closeModal} />}
        {open === 'editLink' && data && <EditLink rowSelect={data} handleClose={closeModal} />}
      </ModalManager>
    </DashboardContent>
    // <DashboardContent>
    //   <Box
    //     sx={{
    //       mb: 3,
    //       display: 'flex',
    //       alignItems: 'center',
    //     }}
    //   >
    //     <Typography variant="h4" sx={{ flexGrow: 1 }}>
    //       Quản lý báo cáo
    //     </Typography>
    //     <ButtonGroup handleOpen={handleOpenCreateLink} />
    //   </Box>

    //   <Card>
    //     <DahsboardAdminTableToolbar
    //       numSelected={table.selected.length}
    //       filterName={filterName}
    //       onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         setFilterName(event.target.value);
    //         table.onResetPage();
    //       }}
    //       delDashboardAdmin={handleRemove}
    //     />

    //     <Scrollbar>
    //       <TableContainer sx={{ overflow: 'unset' }}>
    //         <Table sx={{ minWidth: 800 }}>
    //           <DashboardTableHead
    //             order={table.order}
    //             orderBy={table.orderBy}
    //             rowCount={dataFiltered.length}
    //             numberSelected={table.selected.length}
    //             onSort={table.onSort}
    //             onSelectAllRows={(checked) =>
    //               table.onSelectAllRows(
    //                 checked,
    //                 dataFiltered.map((user) => user.id)
    //               )
    //             }
    //             headLabel={headLabelDashboadAdmin}
    //           />
    //           <TableBody>
    //             {dataFiltered
    //               .slice(
    //                 table.page * table.rowsPerPage,
    //                 table.page * table.rowsPerPage + table.rowsPerPage
    //               )
    //               .map((row) => (
    //                 <DashboardTableRow
    //                   key={row.id}
    //                   row={row}
    //                   selected={table.selected.includes(row.id)}
    //                   onSelectRow={() => {
    //                     table.onSelectRow(row.id);
    //                     setRowSelect(row);
    //                   }}
    //                   onEditRow={() => handleOpenEditLink(row)}
    //                 />
    //               ))}

    //             <TableEmptyRows
    //               height={68}
    //               emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
    //             />

    //             {notFound && <TableNoData searchQuery={filterName} />}
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Scrollbar>

    //     <TablePagination
    //       component="div"
    //       page={table.page}
    //       count={dataFiltered.length}
    //       rowsPerPage={table.rowsPerPage}
    //       onPageChange={table.onChangePage}
    //       rowsPerPageOptions={[5, 10, 25]}
    //       onRowsPerPageChange={table.onChangeRowsPerPage}
    //     />
    //   </Card>

    //   <ModalManager open={openCreateLink} handleClose={handleCloseCreateLink}>
    //     <CreateLink handleClose={handleCloseCreateLink} />
    //   </ModalManager>

    //   <ModalManager open={openEditUser} handleClose={handleCloseEditUser}>
    //     {rowSelect && <EditLink handleClose={handleCloseEditUser} rowSelect={rowSelect} />}
    //   </ModalManager>
    // </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
