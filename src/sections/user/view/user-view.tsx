import Swal from 'sweetalert2';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getAllUser, removeUser } from 'src/apis/user';
import { DashboardContent } from 'src/layouts/dashboard';

import { showAlert } from 'src/components/alert';
import { ModalManager } from 'src/components/modal';
import { headLabelUser } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { useModal, ButtonGroup } from 'src/components/button';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { EditUser } from '../editUser';
import { ChangePass } from '../changePass';
import { CreateUser } from '../createUser';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const queryClient = useQueryClient();
  const table = useTable();
  const [filterName, setFilterName] = useState('');

  const { open, data, openModal, closeModal } = useModal();

  const { data: dataUser = [] } = useQuery<UserProps[]>({
    queryKey: ['dataUser'],
    queryFn: getAllUser,
  });

  const dataFiltered: UserProps[] = applyFilter({
    inputData: dataUser,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleRemove = () => {
    Swal.fire({
      title: 'Bạn có chắc sẽ xoá User này',
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
    mutationFn: (userId) => removeUser(userId),
    onError: () => {
      showAlert({ type: 'error', message: 'User này không tồn tại hoặc đã được xoá' });
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Xoá thành công' });
      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });
    },
  });

  return (
    <DashboardContent>
      <PageHeader
        title="Quản lý người dùng"
        action={
          <ButtonGroup
            handleOpen={() => openModal('createUser')}
            handleImport={() => openModal('importUser')}
            handleExport={() =>
              handleExportData({
                data: dataFiltered,
                fileName: 'Danh sách người dùng',
                columns: headLabelUser,
              })
            }
          />
        }
      />
      <PrimaryTemp
        toolbar={
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(e) => {
              setFilterName(e.target.value);
              table.onResetPage();
            }}
            delUser={handleRemove}
          />
        }
        head={
          <UserTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={dataFiltered.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((u) => u.userId)
              )
            }
            headLabel={headLabelUser}
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
            <UserTableRow
              key={row.userId}
              row={row}
              selected={table.selected.includes(row.userId)}
              onSelectRow={() => table.onSelectRow(row.userId)}
              onEditUser={() => openModal('editUser', row)}
              onChangPass={() => openModal('changePassUser', row)}
            />
          ))}

        <TableEmptyRows
          height={68}
          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
        />
        {notFound && <TableNoData searchQuery={filterName} />}
      </PrimaryTemp>
      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'createUser' && <CreateUser handleClose={closeModal} />}
        {open === 'editUser' && data && <EditUser rowSelect={data} handleClose={closeModal} />}
        {open === 'changePassUser' && data && (
          <ChangePass data={data} handleClose={closeModal} />
        )}
      </ModalManager>
    </DashboardContent>
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
