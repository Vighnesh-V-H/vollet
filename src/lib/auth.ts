export const auth = () => {
  const isAuth = localStorage.getItem("isUnlocked");

  return isAuth;
};
