import { useQuery } from '@tanstack/react-query';

import { TextField } from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import { getUserInfo } from 'src/apis/user';
import { useAuth } from 'src/context/authContext';
import { DashboardContent } from 'src/layouts/dashboard';

import { ModalManager } from 'src/components/modal';
import { useModal, ButtonGroup } from 'src/components/button';
import { PageHeader } from 'src/components/primary-temp/primary-temp';

import { ChangePass } from 'src/sections/user/changePass';

import { EditUserInfo } from '../editUserInfo';

export function ProfileView() {
  const { user } = useAuth();
  const isLocalUser = user?.data?.authType === 'doamin';
  const { open, openModal, closeModal } = useModal();

  const { data: dataUser = {} } = useQuery({
    queryKey: ['userInfo', user?.data.userId],
    queryFn: () => getUserInfo(user?.data.userId),
    enabled: !!user?.data.userId,
  });

  return (
    <>
      <DashboardContent>
        <PageHeader
          title="Thông tin người dùng"
          action={
            <ButtonGroup
              handleEdit={() => openModal('editProfileUser', dataUser)}
              handleChangePass={isLocalUser ? () => openModal('changePass', dataUser) : undefined}
              disabled={!isLocalUser}
            />
          }
        />
        <Grid container spacing={3} mt={5}>
          {/* Cột 1 */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Tên hiển thị"
              value={dataUser?.fullName || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Email"
              value={dataUser?.email || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Bộ phận"
              value={dataUser?.boPhan?.name || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </Grid>

          {/* Cột 2 */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Tên đăng nhập"
              value={dataUser?.userName || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Sinh nhật"
              value={
                dataUser?.brithday
                  ? new Date(dataUser.brithday).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'Chưa có thông tin'
              }
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </Grid>

          {/* Cột 3 */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Điện thoại"
              value={dataUser?.phone || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Địa chỉ"
              value={dataUser?.address || 'Chưa có thông tin'}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </DashboardContent>

      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'editProfileUser' && <EditUserInfo data={dataUser} handleClose={closeModal} />}
        {open === 'changePass' && <ChangePass data={dataUser} handleClose={closeModal} />}
      </ModalManager>
    </>
  );
}
