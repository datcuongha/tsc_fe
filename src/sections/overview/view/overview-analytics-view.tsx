import Slider from 'react-slick';

import { Box, Card, Typography } from '@mui/material';

import { useAuth } from 'src/context/authContext';

export function OverviewAnalyticsView() {
  const { user } = useAuth();

  const slider = {
    // dots: true,
    infinite: true,
    autoplay: true,
    speed: 300,
  };
  const images = [
    'https://benthanhtsc.com/wp-content/uploads/2019/11/dia_oc_01-1-1024x935.jpg',
    'https://benthanhtsc.com/wp-content/uploads/2019/11/dia_oc_02-1-1024x935.jpg',
    'https://benthanhtsc.com/wp-content/uploads/2019/11/dia_oc_06-1024x935.jpg',
  ];

  const SlickSlider: any = Slider;
  
  return (
    <Box p={3}>
      <Card
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg,#1976d2,#42a5f5)',
          color: '#fff',
        }}
      >
        <Typography variant="h5">
          Chào mừng <span>{user?.data.fullName}</span> đến với trang thông tin nội bộ Ben Thanh TSC! 👋
        </Typography>

        <Typography>Chúc bạn luôn làm việc hiệu quả!</Typography>
      </Card>

      {/* Slide */}
      <Card sx={{ mb: 3 }}>

        <Box>
          <SlickSlider {...slider}>
            {images.map((img) => (
              <Box key={img}>
                <Box
                  component="img"
                  src={img}
                  sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    minHeight:'auto',
                    objectFit:'cover'
                  }}
                />
              </Box>
            ))}
          </SlickSlider>
        </Box>
      </Card>
    </Box>
  );
}
