import { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Button, Box, Typography, Grid, Card, CardContent,
  CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  MobileStepper, Container
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductsPage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/products/")
      .then(res => setProducts(res.data))
      .catch(() => alert("Ошибка при загрузке товаров"));
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setStep(0);
  };

  const handleClose = () => setSelectedProduct(null);
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <AppBar position="fixed" color="primary" sx={{ boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: "flex-end", gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleLogout}>Выйти</Button>
              {role === "admin" && (
                <Button color="inherit" onClick={() => navigate("/categories")}>Перейти в админку</Button>
              )}
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>Войти</Button>
          )}
          <Button color="inherit" variant="outlined" onClick={() => navigate("/cart")}>Корзина</Button>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          Каталог товаров
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-evenly",
            maxHeight: "calc(100vh - 200px)", 
            overflowY: "auto" 
          }}
        >
          {products.map(product => (
            <Card
              sx={{
                width: "300px",
                height: 450,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 3,
                boxShadow: 3,
              }}
              key={product.id}
            >
              {product.images[0] && (
                <CardMedia
                  component="img"
                  image={`http://localhost:8000${product.images[0].image_url}`}
                  alt={product.name}
                  sx={{
                    height: 200,
                    width: "100%",
                    objectFit: "cover"
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.price} ₽</Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button fullWidth onClick={() => handleOpen(product)} variant="contained">
                  Подробнее
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>

      <Dialog open={!!selectedProduct} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              {selectedProduct.images.length > 0 && (
                <Box>
                  <CardMedia
                    component="img"
                    height="500"
                    image={`http://localhost:8000${selectedProduct.images[step].image_url}`}
                    alt="product"
                    sx={{ objectFit: "contain", borderRadius: 2 }}
                  />
                  <MobileStepper
                    steps={selectedProduct.images.length}
                    position="static"
                    activeStep={step}
                    nextButton={
                      <IconButton size="small" onClick={handleNext} disabled={step >= selectedProduct.images.length - 1}>
                        <KeyboardArrowRight />
                      </IconButton>
                    }
                    backButton={
                      <IconButton size="small" onClick={handleBack} disabled={step <= 0}>
                        <KeyboardArrowLeft />
                      </IconButton>
                    }
                    sx={{ justifyContent: "center", mt: 1 }}
                  />
                </Box>
              )}
              <Typography variant="body1" sx={{ mt: 2 }}>{selectedProduct.description}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>{selectedProduct.price} ₽</Typography>
            </DialogContent>
            <DialogActions>
              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    onAddToCart(selectedProduct);
                    handleClose();
                  }}
                  variant="contained"
                >
                  Заказать
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleClose();
                    navigate("/login");
                  }}
                  variant="contained"
                >
                  Войти, чтобы заказать
                </Button>
              )}
              <Button onClick={handleClose}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
