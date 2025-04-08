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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:8000/api/categories/";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");

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
    await axios.delete(`${API_URL}${id}/`, { headers });
    fetchCategories();
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Категории
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Новая категория"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button variant="contained" onClick={createCategory}>
          Создать
        </Button>
      </Box>

      <List>
        {categories.map((cat) => (
          <ListItem
            key={cat.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => openEditDialog(cat)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => deleteCategory(cat.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
      </List>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактировать категорию</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={updateCategory} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
