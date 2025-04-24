export const encode = (str: string) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const decode = (str: string) => {
  return atob(
    str
      .padEnd(Math.ceil(str.length / 4) * 4, "=")
      .replace(/-/g, "+")
      .replace(/_/g, "/")
  );
};
