import React from "react";
import { Navigate } from "react-router-dom";
import Login from "./Login";

// Register page that uses the same component as Login but with registration mode
const Register = () => {
  return <Navigate to="/login" replace />;
};

export default Register;
