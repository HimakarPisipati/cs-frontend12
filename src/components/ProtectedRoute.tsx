import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  onNavigate: (page: string) => void;
};

export default function ProtectedRoute({
  children,
  onNavigate,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    onNavigate("login");
    return null;
  }

  return <>{children}</>;
}
