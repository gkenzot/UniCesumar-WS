export function assetUrl(path) {
  const clean = String(path).replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
