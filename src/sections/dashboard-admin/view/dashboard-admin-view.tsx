import Swal from 'sweetalert2';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { removeDashboardLink, getAllDashboardAdmin } from 'src/apis/dashboardAdmin';

import { showAlert } from 'src/components/alert';
import { useTable } from 'src/components/use-table';
// import { Iconify } from 'src/components/iconify';
import { headLabel } from 'src/components/Item/item';
import {  ButtonGroup } from 'src/components/button';
import { useModal, ModalManager } from 'src/components/modal';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { EditLink } from '../editLink';
import { CreateLink } from '../createLink';
import { DashboardTableHead } from '../dashboard-table-head';
import { DahsboardAdminTableToolbar } from '../dashboard-table-toolbar';
import { emptyRows, getComparator, applyFilterDashboardAmin } from '../units';
import { DashboardTableRow, type DashboardProps } from '../dashboard-table-row';

// ----------------------------------------------------------------------

export function AdminView() {
  const queryClient = useQueryClient();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { data, open, closeModal, openModal } = useModal();

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
            headLabel={headLabel.bi}
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
  );
}