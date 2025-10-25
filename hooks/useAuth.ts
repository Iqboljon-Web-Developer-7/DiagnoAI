export const useAuth = () => {
  const role = localStorage.getItem("role") || null;
  const token = localStorage.getItem("access-token") || null;
  return { role, token };
};