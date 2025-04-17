import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItemButton,
} from "@mui/material";
import { Delete, Home } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/auth/register/";
const APIU_URL = "http://localhost:8000/api/auth/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    const res = await axios.get(APIU_URL, { headers });
    setUsers(res.data);
  };

  const createUser = async () => {
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) return;
    await axios.post(
      API_URL,
      { username: newUsername, email: newEmail, password: newPassword, role: newRole },
      { headers }
    );
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
    setCreateDialogOpen(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${APIU_URL}/${id}/`, { headers });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Панель администратора</Typography>
          <List>
            <ListItemButton onClick={() => navigate("/")}>
              <Home sx={{ mr: 1 }} /> Главная
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/categories")}>
              Управление категориями
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/orders")}>
              Заказы
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/products")}>
              Продукты
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/users")}>
              Пользователи
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom align="center">
          Пользователи
        </Typography>

        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
            Создать пользователя
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton edge="end" onClick={() => deleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
          <DialogTitle>Создать пользователя</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Роль"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Отмена</Button>
            <Button onClick={createUser} variant="contained">
              Создать
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
