import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YeldoOS — Developer Portfolio",
    short_name: "YeldoOS",
    description:
      "Interactive frontend developer portfolio in a browser operating system.",
    start_url: "/ru",
    scope: "/",
    display: "standalone",
    background_color: "#07090d",
    theme_color: "#0b0e14",
    orientation: "any",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
