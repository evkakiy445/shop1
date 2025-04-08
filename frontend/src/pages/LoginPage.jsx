import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login/", formData);

      // Проверяем роль пользователя
      const userRole = res.data.user?.role;
      if (userRole !== "admin") {
        setError("Доступ разрешён только администраторам");
        return;
      }

      localStorage.setItem("token", res.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка авторизации: неверные данные или сервер недоступен");
      console.error("Ошибка авторизации", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>Вход в админку</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Логин"
            name="username"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
