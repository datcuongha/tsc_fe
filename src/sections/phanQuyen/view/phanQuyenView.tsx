import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllPq } from 'src/apis/phanQuyen';
import { DashboardContent } from 'src/layouts/dashboard';

import { ButtonGroup } from 'src/components/button';
import { useTable } from 'src/components/use-table';
import { headLabel } from 'src/components/Item/item';
import { LoadingBackdrop } from 'src/components/loading';
import { useModal, ModalManager } from 'src/components/modal';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { CreatePhanQuyen } from '../createPhanQuyen';
import { PhanQuyenTableHead } from '../phanQuyen-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { PhanQuyenTableToolbar } from '../phanQuyen-table-toolbar';
import { PhanQuyenTableRow, type PhanQuyenProps } from '../phanQuyen-table-row';

export function PhanQuyenView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { open, closeModal, openModal } = useModal();

  const { data: dataPhanQuyen = [], isLoading } = useQuery<PhanQuyenProps[]>({
    queryKey: ['dataPhanQuyen'],
    queryFn: getAllPq,
  });

  const dataFiltered: PhanQuyenProps[] = applyFilter({
    inputData: dataPhanQuyen,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  return (
    <>
      <DashboardContent>
        <PageHeader
          title="Quản lý phân quyền"
          action={<ButtonGroup handleOpen={() => openModal('create')} />}
        />
        <PrimaryTemp
          toolbar={
            <PhanQuyenTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
            />
          }
          head={
            <PhanQuyenTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((i) => i.id)
                )
              }
              headLabel={headLabel.phanQuyen}
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
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((row) => (
              <PhanQuyenTableRow
                key={row.id}
                row={row}
                selected={table.selected.includes(row.id)}
                onSelectRow={() => table.onSelectRow(row.id)}
              />
            ))}

          <TableEmptyRows
            height={68}
            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
          />
        </PrimaryTemp>
        <ModalManager open={!!open} handleClose={closeModal}>
          {open === 'create' && <CreatePhanQuyen handleClose={closeModal} />}
        </ModalManager>
      </DashboardContent>
      <LoadingBackdrop open={isLoading} message="Đang tải, vui lòng chờ..." />
    </>
  );
}
