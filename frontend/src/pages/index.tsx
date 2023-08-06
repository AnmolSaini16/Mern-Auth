import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<string | jwt.JwtPayload | null>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      router.push("/signin");
    }
    if (token) {
      const user = jwt.decode(token);
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("signin");
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {!user ? (
        <CircularProgress />
      ) : (
        <Box>
          <h1>Home Page </h1>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
