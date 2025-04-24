import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem', // 14px
          padding: '6px 10px',
        },
      },
    },
  },
});

export default theme;