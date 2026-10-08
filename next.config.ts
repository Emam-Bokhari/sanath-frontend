import type { NextConfig } from "next";
import os from "os";

const getLocalOrigins = (): string[] => {
  const origins = new Set<string>([
    "localhost",
    "127.0.0.1",
    "10.10.7.10",
    "10.10.26.181",
  ]);
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4") {
          origins.add(net.address);
        }
      }
    }
  } catch {
    // fallback to default origins
  }
  return Array.from(origins);
};

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: getLocalOrigins(),
};

export default nextConfig;