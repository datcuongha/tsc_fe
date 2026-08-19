import { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Box, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllDmhh, importDmhh, syncDmhhKiot, importDinhMuc } from 'src/apis/danhMuc';

import { showAlert } from 'src/components/alert';
import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { LoadingBackdrop } from 'src/components/loading';
import { TableNoData } from 'src/components/table-empty/table-no-data';
import { TableEmptyRows } from 'src/components/table-empty/table-empty-rows';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { emptyRows } from '../utils';
import { DanhMucTableRow } from '../danhMuc-table-row';
import { DanhMucTableHead } from '../danhMuc-table-head';
import { DanhMucTableToolbar } from '../danhMuc-table-toolbar';

import type { DanhMucProps } from '../danhMuc-table-row';

export function Dmhh() {
  const queryClient = useQueryClient();

  const filetRef = useRef<HTMLInputElement>(null);
  const importTypeRef = useRef<'dmhh' | 'dinhMuc'>('dmhh');
  const table = useTable();

  // =========================
  // SEARCH
  // =========================
  const [filterName, setFilterName] = useState('');
  const [search, setSearch] = useState('');

  // =========================
  // SERVER PAGINATION
  // =========================
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // =========================
  // DEBOUNCE SEARCH
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(filterName.trim());
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [filterName]);

  // =========================
  // GET DATA
  // =========================
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['dataDmhh', page, rowsPerPage, search],

    queryFn: () =>
      getAllDmhh({
        page: page + 1,
        limit: rowsPerPage,
        search,
      }),

    placeholderData: (previousData) => previousData,
  });
  // =========================
  // DATA
  // =========================
  const dataDmhh: DanhMucProps[] = data?.content ?? [];
  const total = data?.total ?? 0;

  const notFound = !dataDmhh.length && !!search;

  // =========================
  // IMPORT
  // =========================
  const handleImport = (type: 'dmhh' | 'dinhMuc' = 'dmhh') => {
    importTypeRef.current = type;
    filetRef.current?.click();
  };

  const handleAddFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (importTypeRef.current === 'dinhMuc') {
      mutationDinhMuc.mutate(file);
    } else {
      mutation.mutate(file);
    }

    // cho phép chọn lại cùng một file
    e.target.value = '';
  };

  const mutationDinhMuc = useMutation({
    mutationFn: (file: File) => importDinhMuc(file),

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Import định mức thành công',
      });
    },

    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

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

  // =========================
  // SYNC KIOT
  // =========================
  const handleGetApi = () => {
    mutationApi.mutate();
  };

  const mutationApi = useMutation({
    mutationFn: () => syncDmhhKiot(),

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Lấy api thành công',
      });

      // Nếu sync API làm thay đổi dữ liệu DMHH
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

  // =========================
  // PAGINATION
  // =========================
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);

    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <DashboardContent>
        <PageHeader
          title="Danh mục hàng hoá"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={() => handleImport('dinhMuc')}>
                Định mức
              </Button>
              <ButtonGroup handleImport={() => handleImport('dmhh')} handleGetApi={handleGetApi} />
            </Box>
          }
        />

        <PrimaryTemp
          toolbar={
            <DanhMucTableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);

                // reset page khi search
                setPage(0);

                // reset selection
                table.onResetPage();
              }}
            />
          }
          head={
            <DanhMucTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={total}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataDmhh.map((u) => u.id)
                )
              }
              headLabel={headLabel.danhMucHangHoa}
            />
          }
          pagination={{
            page,
            count: total,
            rowsPerPage,

            onPageChange: handleChangePage,

            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
        >
          {/* =========================
              DATA
          ========================= */}

          {dataDmhh.map((row) => (
            <DanhMucTableRow
              key={row.id}
              row={row}
              selected={table.selected.includes(row.id)}
              onSelectRow={() => table.onSelectRow(row.id)}
            />
          ))}

          {/* =========================
              EMPTY ROWS
          ========================= */}

          <TableEmptyRows height={68} emptyRows={emptyRows(page, rowsPerPage, total)} />

          {/* =========================
              NO DATA
          ========================= */}

          {notFound && <TableNoData searchQuery={search} />}
        </PrimaryTemp>
      </DashboardContent>

      {/* =========================
          LOADING
      ========================= */}

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

      {/* =========================
          BACKGROUND FETCH
      ========================= */}

      {isFetching && !isLoading && <></>}

      {/* =========================
          FILE INPUT
      ========================= */}

      <input type="file" ref={filetRef} hidden accept=".xlsx,.xls" onChange={handleAddFileImport} />
    </>
  );
}
