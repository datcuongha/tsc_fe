import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllDmhh, importDmhh, syncDmhhKiot } from 'src/apis/danhMuc';

import { showAlert } from 'src/components/alert';
import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { LoadingBackdrop } from 'src/components/loading';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { DanhMucTableRow } from '../danhMuc-table-row';
import { DanhMucTableHead } from '../danhMuc-table-head';
import { DanhMucTableToolbar } from '../danhMuc-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export function Dmhh() {
  const queryClient = useQueryClient();
  const filetRef = useRef<HTMLInputElement>(null);
  // const { user } = useAuth();
  const [filterName, setFilterName] = useState('');

  const table = useTable();

  const { data: dataDmhh = [], isLoading } = useQuery({
    queryKey: ['dataDmhh'],
    queryFn: getAllDmhh,
  });

  const dataFiltered = applyFilter({
    inputData: dataDmhh,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleImport = () => {
    filetRef.current?.click();
  };

  const handleAddFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    mutation.mutate(file);
    e.target.value = '';
  };

  const mutation = useMutation({
    mutationFn: (file: File) => importDmhh(file),

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Import thành công',
      });
      queryClient.invalidateQueries({
        queryKey: ['dataDmhh'],
      });
    },
    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

  const handleGetApi = () => {
    mutationApi.mutate();
  };

  const mutationApi = useMutation({
    mutationFn: () => syncDmhhKiot(),
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Lấy api thành công' });
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
          title="Danh mục hàng hoá"
          action={<ButtonGroup handleImport={handleImport} handleGetApi={handleGetApi} />}
        />

        <PrimaryTemp
          toolbar={
            <DanhMucTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
            />
          }
          head={
            <DanhMucTableHead
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
              headLabel={headLabel.danhMucHangHoa}
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
              <DanhMucTableRow
                key={row.id}
                row={row}
                selected={table.selected.includes(row.id)}
                onSelectRow={() => table.onSelectRow(row.id)}
              />
            ))}

          <TableEmptyRows
            height={68}
            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
          >
            {notFound && <TableNoData searchQuery={filterName} />}
          </TableEmptyRows>
        </PrimaryTemp>
      </DashboardContent>

      <LoadingBackdrop
        open={mutation.isPending || mutationApi.isPending || isLoading}
        message={
          mutation.isPending
            ? 'Đang xử lý, vui lòng chờ...'
            : mutationApi.isPending
              ? 'Đang đồng bộ dữ liệu, vui lòng chờ...'
              : isLoading
                ? 'Đang tải dữ liệu, vui lòng chờ...'
                : ''
        }
      />
      <input type="file" ref={filetRef} hidden accept=".xlsx,.xls" onChange={handleAddFileImport} />
    </>
  );
}
