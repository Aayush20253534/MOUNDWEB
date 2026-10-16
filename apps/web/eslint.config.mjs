import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "out/**", "next-env.d.ts", "src/generated/prisma/**"] },
  ...nextVitals,
  ...nextTypescript,
];
export default config;
