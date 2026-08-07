import type { PrintDhProps } from './printDh-table-row';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type ApplyFilterProps = {
  inputData: PrintDhProps[];
  filterName: string;
  comparator: (a: any, b: any) => number;

  filters?: {
    ncc: string[];
    chiNhanh: string[];
    fromDate: string;
    toDate: string;
    month: string;
    year: string;
  };
};

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filters,
}: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  // Search NCC
  if (filterName) {
    data = data.filter((item) =>
      item.tenNcc.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  // NCC
  if (filters?.ncc?.length) {
    data = data.filter((item) =>
      filters.ncc.includes(item.tenNcc)
    );
  }

  // Chi nhánh
  if (filters?.chiNhanh?.length) {
    data = data.filter((item) =>
      item.detailPhieuDeXuat?.some((d) =>
        filters.chiNhanh.includes(d.chiNhanh)
      )
    );
  }

  // Từ ngày
  if (filters?.fromDate) {
    const fromDate = new Date(filters.fromDate);

    data = data.filter((item) => {
      if (!item.createDate) return false;

      return new Date(item.createDate) >= fromDate;
    });
  }

  // Đến ngày
  if (filters?.toDate) {
    const toDate = new Date(filters.toDate);
    toDate.setHours(23, 59, 59, 999);

    data = data.filter((item) => {
      if (!item.createDate) return false;

      return new Date(item.createDate) <= toDate;
    });
  }

  // Tháng
  if (filters?.month) {
    data = data.filter((item) => {
      if (!item.createDate) return false;

      const month = String(
        new Date(item.createDate).getMonth() + 1
      ).padStart(2, '0');

      return month === filters.month;
    });
  }

  // Năm
  if (filters?.year) {
    data = data.filter((item) => {
      if (!item.createDate) return false;

      return (
        String(new Date(item.createDate).getFullYear()) ===
        filters.year
      );
    });
  }

  return data;
}