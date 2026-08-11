import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getAllDatHang } from 'src/apis/datHang';
import { useAuth } from 'src/context/authContext';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/use-table';
import { ButtonGroup } from 'src/components/button';
import { headLabel } from 'src/components/Item/item';
import { handleExportData } from 'src/components/export';
import { LoadingBackdrop } from 'src/components/loading';
import { useModal, ModalManager } from 'src/components/modal';
import { PageHeader, PrimaryTemp } from 'src/components/primary-temp/primary-temp';

import { InDeXuat } from '../inDeXuat';
import { InDonDatHang } from '../inDonDatHang';
import { EditDatHangTM } from '../editDatHangTM';
import { PrintDhTableHead } from '../printDh-table-head';
import { PrintDhtableToolbar } from '../printDh-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { DonHangFilters, type DonHangFiltersState } from '../filter';
import { PrintDhTableRow, type PrintDhProps } from '../printDh-table-row';
import { TableNoData } from '../../../../components/table-empty/table-no-data';
import { TableEmptyRows } from '../../../../components/table-empty/table-empty-rows';

export function DonDatHangView() {
  const [openFilter, setOpenFilter] = useState(false);
  const { user } = useAuth();

  const [filters, setFilters] = useState<DonHangFiltersState>({
    ncc: [],
    chiNhanh: [],
    fromDate: '',
    toDate: '',
    month: '',
    year: '',
  });
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { data, open, openModal, closeModal } = useModal();

  const { data: dataDH = [], isLoading } = useQuery<PrintDhProps[]>({
    queryKey: ['dataDH'],
    queryFn: getAllDatHang,
  });

  const navigate = useNavigate();

  const handleOpenPhieu = (row: PrintDhProps) => {
    if (row.canApprove) {
      navigate(`/phe-duyet/${row.id}`);
      return;
    }

    openModal('inDeXuat', row);
  };
  const dataFiltered: PrintDhProps[] = applyFilter({
    inputData: dataDH,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filters,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const exportData =
    table.selected.length > 0
      ? dataFiltered
          .filter((phieu) => table.selected.includes(phieu.id))
          .flatMap((phieu) =>
            (phieu.phieuDeXuatDetail || [])
              .sort((a, b) => (a.phieuDatHangNhap ?? '').localeCompare(b.phieuDatHangNhap ?? ''))
              .map((item) => ({
                'Mã phiếu': phieu.maPhieu,
                'Mã đặt hàng nhập': item.phieuDatHangNhap,
                'Chi nhánh': item.chiNhanh,
                'Thương hiệu': phieu.tenNcc,
                'Mã hàng': item.maHang,
                'Tên hàng': item.tenHang,
                'Ghi chú': item.ghiChuKho,
                'Đơn giá': item.giaVon,
                'SL kho đặt': item.slKhoDat,
                'SL tồn cuối': item.tonCuoi,
                'SL bán': item.xuatBan,
                'SL nhập': item.nhapChuyen,
              }))
          )
      : dataFiltered.flatMap((phieu) =>
          (phieu.phieuDeXuatDetail || [])
            .sort((a, b) => (a.phieuDatHangNhap ?? '').localeCompare(b.phieuDatHangNhap ?? ''))
            .map((item) => ({
              'Mã phiếu': phieu.maPhieu,
              'Mã đặt hàng nhập': item.phieuDatHangNhap,
              'Chi nhánh': item.chiNhanh,
              'Thương hiệu': phieu.tenNcc,
              'Mã hàng': item.maHang,
              'Tên hàng': item.tenHang,
              'Ghi chú': item.ghiChuKho,
              'Đơn giá': item.giaVon,
              'SL kho đặt': item.slKhoDat,
              'SL tồn cuối': item.tonCuoi,
              'SL bán': item.xuatBan,
              'SL nhập': item.nhapChuyen,
            }))
        );

  return (
    <>
      <DashboardContent>
        <PageHeader
          title="Đơn đặt hàng"
          action={
            <ButtonGroup
              handleExport={() =>
                handleExportData({
                  fileName: 'Danh sách phiếu đặt hàng',
                  data: exportData,
                  columns: [
                    { id: 'Mã phiếu', label: 'Mã phiếu' },
                    { id: 'Mã đặt hàng nhập', label: 'Mã đặt hàng nhập' },
                    { id: 'Chi nhánh', label: 'Chi nhánh' },
                    { id: 'Thương hiệu', label: 'Thương hiệu' },
                    { id: 'Mã hàng', label: 'Mã hàng' },
                    { id: 'Tên hàng', label: 'Tên hàng' },
                    { id: 'ĐVT', label: 'ĐVT' },
                    { id: 'Đơn giá', label: 'Đơn giá' },
                    { id: 'Ghi chú', label: 'Ghi chú' },
                    { id: 'SL kho đặt', label: 'SL kho đặt' },
                    { id: 'SL tồn cuối', label: 'SL tồn cuối' },
                    { id: 'SL bán', label: 'SL bán' },
                    { id: 'SL nhập', label: 'SL nhập' },
                  ],
                })
              }
            />
          }
        />
        <PrimaryTemp
          toolbar={
            <PrintDhtableToolbar
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
              onOpenFilter={() => setOpenFilter(true)}
            />
          }
          head={
            <PrintDhTableHead
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
              headLabel={headLabel.deXuat}
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
              <PrintDhTableRow
                key={row.id}
                row={row}
                selected={table.selected.includes(row.id)}
                onSelectRow={() => table.onSelectRow(row.id)}
                printDX={() => handleOpenPhieu(row)}
                printDDH={() => openModal('inDonDatHang', row)}
                editDDH={() => openModal('editDonDatHang', row)}
                editDatHangTM={() => openModal('editDatHangTM', row)}
              />
            ))}

          <TableEmptyRows
            height={68}
            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
          />
          {notFound && <TableNoData searchQuery={filterName} />}
        </PrimaryTemp>

        {open === 'inDeXuat' && data && (
          <ModalManager open handleClose={closeModal} maxWidth="xl">
            <InDeXuat data={data} handleClose={closeModal} userButton={user} />
          </ModalManager>
        )}

        {open === 'inDonDatHang' && data && (
          <ModalManager open handleClose={closeModal} maxWidth="md">
            <InDonDatHang data={data} handleClose={closeModal} />
          </ModalManager>
        )}

        {open === 'editDatHangTM' && data && (
          <ModalManager open handleClose={closeModal} maxWidth="xl">
            <EditDatHangTM data={data} handleClose={closeModal} />
          </ModalManager>
        )}

        <DonHangFilters
          openFilter={openFilter}
          canReset={
            filters.ncc.length > 0 ||
            filters.chiNhanh.length > 0 ||
            filters.fromDate !== '' ||
            filters.toDate !== '' ||
            filters.month !== '' ||
            filters.year !== ''
          }
          filters={filters}
          onCloseFilter={() => setOpenFilter(false)}
          onResetFilter={() =>
            setFilters({
              ncc: [],
              chiNhanh: [],
              fromDate: '',
              toDate: '',
              month: '',
              year: '',
            })
          }
          onSetFilters={(value) =>
            setFilters((prev) => ({
              ...prev,
              ...value,
            }))
          }
          options={{
            ncc: [...new Set(dataDH.map((i) => i.tenNcc))]
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b, 'vi')),

            chiNhanh: [
              ...new Set(dataDH.flatMap((i) => i.phieuDeXuatDetail?.map((x) => x.chiNhanh) || [])),
            ]
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b, 'vi')),

            years: [
              ...new Set(
                dataDH
                  .filter((i) => i.createDate)
                  .map((i) => String(new Date(i.createDate!).getFullYear()))
              ),
            ].sort((a, b) => Number(b) - Number(a)),
          }}
        />
      </DashboardContent>
      
      <LoadingBackdrop
        open={isLoading}
        message='Đang tải, vui lòng chờ...'
      />
    </>
  );
}
