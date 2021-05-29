module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      // "/": { page: "/" },
      "/simulation": { page: "/Components/Home" },
      "/sectors": { page: "/Components/Home" },
      "/revenue": { page: "/Components/Home" },
      "/performance": { page: "/Components/Home" },
      "/comparision": { page: "/Components/Home" },
      "/sp500": { page: "/Components/Home" },
      "/login": { page: "/Components/Home" },
      "/about": { page: "/Components/Home" },
      "/top/:num/:type": { page: "/Components/Home" },
      "/companydetails/:name": { page: "/Components/CompanyDetails" },
    };
  },
};
