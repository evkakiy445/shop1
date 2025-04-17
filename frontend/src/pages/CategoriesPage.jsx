import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Drawer,
  ListItemButton,
} from "@mui/material";
import { Edit, Delete, Home } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/categories/";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCategories = async () => {
    const res = await axios.get(API_URL, { headers });
    setCategories(res.data);
  };

  const createCategory = async () => {
    if (!newName.trim()) return;
    await axios.post(API_URL, { name: newName }, { headers });
    setNewName("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      await axios.delete(`${API_URL}${id}/`, { headers });
      fetchCategories();
    }
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setEditedName(category.name);
    setEditDialogOpen(true);
  };

  const updateCategory = async () => {
    await axios.put(`${API_URL}${editingCategory.id}/`, { name: editedName }, { headers });
    setEditDialogOpen(false);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            Управление категориями
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
          <TextField
            label="Новая категория"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ maxWidth: "350px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createCategory}
            sx={{ height: "100%", minWidth: "120px" }}
          >
            Создать
          </Button>
        </Box>

        <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ maxHeight: "60vh", overflowY: "auto", mb: 2 }}>
            <List>
              {categories.map((cat) => (
                <ListItem
                  key={cat.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: 1,
                  }}
                >
                  <ListItemText primary={cat.name} />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton edge="end" onClick={() => openEditDialog(cat)} sx={{ color: "#1976d2" }}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => deleteCategory(cat.id)} sx={{ color: "#d32f2f" }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider />
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Количество категорий: {categories.length}
            </Typography>
          </Box>
        </Paper>

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm">
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogContent>
            <TextField
              label="Имя категории"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Отмена
            </Button>
            <Button onClick={updateCategory} variant="contained" color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
