import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";

interface ISignInForm {
  name: string;
  email: string;
  password: string;
}

enum ButtonType {
  Register = "Register",
  SignIn = "Login",
}

const intitalValues = {
  name: "",
  email: "",
  password: "",
};

export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState<ISignInForm>(intitalValues);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [enabledButton, setEnabledButton] = useState<string>(
    ButtonType.Register
  );

  const handleChange = (key: string, value: string) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleSumbit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formValues,
      };
      const response = await axios.post(
        enabledButton === ButtonType.Register
          ? "http://localhost:5000/api/register"
          : "http://localhost:5000/api/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        if (response.data?.status) {
          enqueueSnackbar(response.data.status, {
            variant: "success",
            anchorOrigin: { horizontal: "right", vertical: "top" },
            persist: false,
          });
          setFormValues(intitalValues);
          localStorage.setItem("token", response.data.token ?? "");
          router.push("/");
        } else
          enqueueSnackbar(response.data.error, {
            variant: "error",
            anchorOrigin: { horizontal: "right", vertical: "top" },
            persist: false,
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const buttonConfig = [
    { label: ButtonType.Register, id: 1 },
    { label: ButtonType.SignIn, id: 2 },
  ];

  const handleBtnClick = (label: string) => {
    setEnabledButton(label);
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width={450} height={400} p={4} borderRadius={2} boxShadow={2}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} textAlign="center">
            <ButtonGroup aria-label="Disabled elevation buttons">
              {buttonConfig.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleBtnClick(item.label)}
                  style={{ width: 120 }}
                  variant={
                    item.label === enabledButton ? "contained" : "outlined"
                  }
                  sx={{ margin: "10px 0" }}
                >
                  {item.label}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            {enabledButton === ButtonType.Register && (
              <TextField
                label="Name"
                fullWidth
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={formValues.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSumbit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} />
              ) : enabledButton === ButtonType.Register ? (
                "Register"
              ) : (
                "Sign In"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
