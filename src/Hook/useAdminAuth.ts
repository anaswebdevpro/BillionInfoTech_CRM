import { useMemo } from "react";

export default function useAdminAuth() {
  return useMemo(() => {
    try {
      const adminToken =
        typeof window !== "undefined"
          ? localStorage.getItem("adminToken")
          : null;
      const adminDataRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("adminData")
          : null;
      const adminData = adminDataRaw ? JSON.parse(adminDataRaw) : null;
      return { adminToken, adminData };
    } catch {
      return { adminToken: null, adminData: null };
    }
  }, []);
}
