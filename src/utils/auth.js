
export function encodeString(input = null) {
    const index = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+{}[]|:;<>,.?/~`";
    const base = index.length;
    if (!input) return null;
  try {
    let encoded = '';
    let number = typeof input === "number" ? input : [...input].reduce((acc, char) => acc * 256 + char.charCodeAt(0), 0);

    while (number > 0) {
      let remainder = number % base;
      encoded = index[remainder] + encoded;
      number = Math.floor(number / base);
    }

    return encoded || index[0]; // Ensure at least one character
  } catch (e) {
    console.error(`encodeString Error:`, e.message);
    return null;
  }
}


