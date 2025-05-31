export function isTokenExpired(exp) {
  return exp && exp < Math.floor(Date.now() / 1000);
}