import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Paper,
  Container,
  Divider,
  Drawer,
  ListItemButton,
  IconButton,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Ошибка при загрузке заказов");
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/${orderId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      setError("Ошибка при удалении заказа");
      console.error(err);
    }
  };

  const handleToggleDetails = (orderId) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

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
            Управление заказами
          </Typography>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {orders.map((order) => (
                <ListItem key={order.id} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2, width: "100%" }}>
                    <ListItemText
                      primary={`Заказ #${order.id} от ${new Date(order.created_at).toLocaleString()}`}
                      secondary={`Количество товаров: ${order.items.length}`}
                    />
                    <Button variant="outlined" color="error" onClick={() => handleDelete(order.id)}>
                      Удалить
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleToggleDetails(order.id)}
                      sx={{ ml: 2 }}
                    >
                      {openOrderId === order.id ? "Скрыть детали" : "Показать детали"}
                    </Button>

                    <Collapse in={openOrderId === order.id} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Детали заказа:</Typography>
                        <List>
                          {order.items.map((item) => (
                            <ListItem key={item.id}>
                              <ListItemText
                                primary={`Продукт: ${item.product_name}`}
                                secondary={`Количество: ${item.quantity}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Collapse>
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}