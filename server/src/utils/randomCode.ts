import crypto from "crypto";

export function generateRandomCode() {
  const charset =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
}
