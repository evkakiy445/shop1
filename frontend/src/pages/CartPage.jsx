import { useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const items = cart.map(p => ({ product_id: p.id, quantity: 1 }));
      await axios.post("http://localhost:8000/api/orders/", { items }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Заказ успешно оформлен!");
      setCart([]);
    } catch (err) {
      alert("Ошибка при оформлении заказа");
      console.error(err);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "2rem" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}>Корзина</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ textTransform: 'none' }}
          >
            Вернуться на главную
          </Button>
          <Button
            variant="contained"
            onClick={handleOrder}
            sx={{ textTransform: 'none', padding: '0.8rem 2rem' }}
          >
            Оформить заказ
          </Button>
        </Box>

        {cart.length === 0 ? (
          <Typography variant="h6" align="center">Корзина пуста</Typography>
        ) : (
          <>
            <Grid container spacing={4}>
              {cart.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, boxShadow: 3 }}>
                    {product.images[0] && (
                      <CardMedia
                        component="img"
                        image={`http://localhost:8000${product.images[0].image_url}`}
                        alt={product.name}
                        sx={{
                          height: 200,
                          objectFit: 'cover',
                          borderTopLeftRadius: 3,
                          borderTopRightRadius: 3
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{product.price} ₽</Typography>
                    </CardContent>
                    <Button
                      color="error"
                      onClick={() => handleRemove(product.id)}
                      sx={{ m: 1, textTransform: 'none' }}
                    >
                      Удалить
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
