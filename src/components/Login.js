import React, { useState, useContext } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const { authenticate } = useContext(AuthContext);
  const navigate = useNavigate(); // Obtener la función navigate de React Router

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setError(""); // Limpiar cualquier error previo
    try {
      const resultado = await authenticate(username, password);
      if (resultado) {
        navigate("/");
      }
    } catch (error) {
      setError(error.message); // Establecer mensaje de error
    }
  };

  return (
    <div className="cont">
      <div className="container-login" style={{ gap: "1rem" }}>
        <h2>Inicio de sesión</h2>
        {error && (
          <Alert severity="error" sx={{ width: "100%", textAlign: "center" }}>
            {error}
          </Alert>
        )}
        <TextField
          sx={{ width: "100%" }}
          label="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Contraseña
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button sx={{ width: "100%" }} variant="outlined" onClick={handleLogin}>
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Login;
