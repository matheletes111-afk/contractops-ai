import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://analyze-tool.srvtechservices.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard", "/contracts", "/results", "/processing"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
