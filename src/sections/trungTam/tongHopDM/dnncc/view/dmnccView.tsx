import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllDmncc, importDmncc } from 'src/apis/danhMuc';

import { useModal } from 'src/components/modal';
import { showAlert } from 'src/components/alert';
import { ButtonGroup } from 'src/components/button';
import { useTable } from 'src/components/use-table';
import { headLabel } from 'src/components/Item/item';
import { LoadingBackdrop } from 'src/components/loading';
import { handleExportData } from 'src/components/export';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { DmnccTableRow } from '../dmncc-table-row';
import { DmnccTableHead } from '../dmncc-table-head';
import { applyFilter, getComparator } from '../utils';
import { DmnccTableToolbar } from '../dmncc-table-toolbar';

import type { DmnccProps } from '../dmncc-table-row';

export function Dmncc() {
  const { open, openModal, closeModal, data } = useModal();
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: dataNcc = [], isLoading } = useQuery({
    queryKey: ['dataNcc'],
    queryFn: getAllDmncc,
  });

  const dataFiltered: DmnccProps[] = applyFilter({
    inputData: dataNcc,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleAllFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    mutation.mutate(file);
    e.target.value = '';
  };

  const mutation = useMutation({
    mutationFn: (file: File) => importDmncc(file),

    onSuccess: () => {
      showAlert({ type: 'success', message: 'Import thành công' });
      queryClient.invalidateQueries({
        queryKey: ['dataNcc'],
      });
    },
    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });


  return (
    <>
      <DashboardContent>
        <PageHeader
          title="Danh mục nhà cung cấp"
          action={
            <ButtonGroup
              handleImport={handleImport}
              handleExport={() =>
                handleExportData({
                  data: dataFiltered,
                  fileName: 'Danh mục nhà cung cấp',
                  columns: headLabel.danhMucNcc,
                })
              }
            />
          }
        />

        <PrimaryTemp
          toolbar={
            <DmnccTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
            />
          }
          head={
            <DmnccTableHead
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
              headLabel={headLabel.danhMucNcc}
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
              <DmnccTableRow
                key={row.id}
                row={row}
                selected={table.selected.includes(row.id)}
                onSelectRow={() => table.onSelectRow(row.id)}
              />
            ))}
        </PrimaryTemp>
      </DashboardContent>
      <LoadingBackdrop
        open={mutation.isPending || isLoading}
        message={mutation.isPending ? 'Đang xử lý, vui lòng chờ...' : 'Đang tải, vui lòng chờ...'}
      />
      <input type="file" ref={fileRef} hidden accept=".xlsx,.xls" onChange={handleAllFileImport} />
    </>
  );
}
