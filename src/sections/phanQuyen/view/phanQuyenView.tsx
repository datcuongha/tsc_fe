import { useQuery } from '@tanstack/react-query';

import { getAllPq } from 'src/apis/phanQuyen';
import { DashboardContent } from 'src/layouts/dashboard';

import { ButtonGroup } from 'src/components/button';
import { LoadingBackdrop } from 'src/components/loading';
import { PageHeader } from 'src/components/primary-temp/primary-temp';

export function PhanQuyenView() {
  const { data: dataPhanQuyen = [], isLoading } = useQuery({
    queryKey: ['dataPhanQuyen'],
    queryFn: getAllPq,
  });

  return (
    <>
      <DashboardContent>
        <PageHeader title="Quản lý phân quyền" action={<ButtonGroup />} />
      </DashboardContent>
      <LoadingBackdrop open={isLoading} message="Đang tải, vui lòng chờ..." />
    </>
  );
}
