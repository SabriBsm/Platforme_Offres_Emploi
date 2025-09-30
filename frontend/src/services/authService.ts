const API_URL = "http://localhost:3000/api";


/*
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur de connexion");
  }

  const data = await response.json();

  // Stocker token et utilisateur
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // ✅ Stocker student si présent
  if (data.student) {
    localStorage.setItem("student", JSON.stringify(data.student));
  }

  return data.user;
};

*/

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur de connexion");
  }

  const data = await response.json();

  // Stocker token et utilisateur
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // Stocker student si présent
  if (data.student) {
    localStorage.setItem("student", JSON.stringify(data.student));
  } else {
    localStorage.removeItem("student");
  }

  // Stocker company si présent
  if (data.company) {
    localStorage.setItem("company", JSON.stringify(data.company));
  } else {
    localStorage.removeItem("company");
  }

  return data.user;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("student"); // Nettoyer aussi student
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") || "null");
};

export const getStudent = () => {
  return JSON.parse(localStorage.getItem("student") || "null");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const forgotPassword = async (email: string) => {
  const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erreur lors de la demande de réinitialisation");
  }

  return res.json();
};