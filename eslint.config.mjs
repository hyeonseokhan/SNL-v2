import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 파서/API 파일: 외부 API 응답이 untyped JSON이므로 any 허용
  {
    files: ["src/lib/parser/**/*.ts", "src/lib/api/**/*.ts", "src/lib/cache/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // 캐릭터 컴포넌트: 외부 CDN 이미지에 next/image 대신 <img> 허용
  {
    files: ["src/components/character/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
