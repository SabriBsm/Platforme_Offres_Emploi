export const getStudentId = (): number | null => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.studentId || parsedUser.id || null; // selon la structure renvoyée par ton backend
  } catch {
    return null;
  }
};
