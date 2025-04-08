import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, TextField, Typography, Grid, Card, CardContent,
    CardMedia, MenuItem, Select, InputLabel, FormControl
  } from "@mui/material";
  import { Edit, Delete } from "@mui/icons-material";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  
  const API_URL = "http://localhost:8000/api/products/";
  const CATEGORY_URL = "http://localhost:8000/api/categories/";
  const IMAGE_URL = "http://localhost:8000";
  const IMAGE_DELETE_URL = "http://localhost:8000/api/product-images/";
  
  export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
      name: "", description: "", price: "", category: ""
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const navigate = useNavigate();
  
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        const res = await axios.get(API_URL, { headers });
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        const res = await axios.get(CATEGORY_URL, { headers });
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        fetchProducts();
        fetchCategories();
      }
    }, []);
  
    const handleOpen = (product = null) => {
      setSelectedProduct(product);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        });
        setProductImages(product.images);
      } else {
        setFormData({ name: "", description: "", price: "", category: "" });
        setProductImages([]);
      }
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setImageFiles([]);
      setImagePreviews([]);
    };
  
    const handleSubmit = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      let res;
      if (selectedProduct) {
        res = await axios.put(`${API_URL}${selectedProduct.id}/`, formData, { headers });
      } else {
        res = await axios.post(API_URL, formData, { headers });
      }
  
      if (imageFiles.length > 0) {
        const imageData = new FormData();
        imageFiles.forEach(file => {
          imageData.append("image", file);
        });
        imageData.append("product", res.data.id);
        await axios.post("http://localhost:8000/api/product-images/", imageData, { headers });
      }
  
      fetchProducts();
      handleClose();
    };
  
    const handleDelete = async (id) => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      await axios.delete(`${API_URL}${id}/`, { headers });
      fetchProducts();
    };
  
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImageFiles(files);
  
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    };
  
    const handleImageDelete = async (imageId) => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        await axios.delete(`${IMAGE_DELETE_URL}${imageId}/`, { headers });
        setProductImages(productImages.filter(image => image.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    };
  
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Товары</Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>Добавить товар</Button>
        <Grid container spacing={2}>
          {products.length === 0 ? (
            <Typography variant="h6">Нет товаров для отображения.</Typography>
          ) : (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  {product.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={IMAGE_URL + product.images[0].image_url}
                      alt={product.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography>₽ {product.price}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <IconButton onClick={() => handleOpen(product)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
  
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedProduct ? "Редактировать" : "Создать"} товар</DialogTitle>
          <DialogContent>
            <TextField label="Название" fullWidth margin="normal" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Описание" fullWidth margin="normal" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <TextField label="Цена" type="number" fullWidth margin="normal" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
  
            <FormControl fullWidth margin="normal">
              <InputLabel>Категория</InputLabel>
              <Select
                value={formData.category}
                label="Категория"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            {selectedProduct && (
              <>
                <Typography variant="h6">Изображения товара:</Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {productImages.map((image) => (
                    <Grid item key={image.id} xs={4}>
                      <img src={IMAGE_URL + image.image_url} alt={`Image ${image.id}`} style={{ width: '100%', height: 'auto' }} />
                      <IconButton color="error" onClick={() => handleImageDelete(image.id)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
                {/* Кнопка для загрузки изображений при редактировании */}
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                  Загрузить изображения
                  <input type="file" hidden multiple onChange={handleImageChange} />
                </Button>
              </>
            )}
  
            {!selectedProduct && (
              <>
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                  Загрузить изображения
                  <input type="file" hidden multiple onChange={handleImageChange} />
                </Button>
  
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item key={index} xs={4}>
                      <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  