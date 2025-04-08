import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Paper } from "@mui/material";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: 4,
          borderRadius: 3,
          textAlign: "center",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Админка интернет-магазина
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/categories")}
        >
          Категории
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/products")}
        >
          Товары
        </Button>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
