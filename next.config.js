module.exports = {
  eslint: {
    dirs: ["src/app", "src/components", "src/lib"], // Only run ESLint on app source directories during production builds (next build)
    ignoreDuringBuilds: false,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};
