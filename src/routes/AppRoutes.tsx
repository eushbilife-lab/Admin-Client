import { Suspense, useEffect, useState } from "react";
import PrivateRoute from "./PrivateRoute";
import {
  public_routes,
  private_routes,
  IRoute,
  admin_private_routes,
  globalAdmin_private_routes,
  conditionalRoutes,
  data_entry_private_routes,
  data_author_private_routes,
} from "routes";
import CircleLoader from "@core/basic-components/CircleLoader";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "redux/hooks";

function routesForRole(user: { role?: string; addExpense?: boolean }): IRoute[] {
  const role = String(user.role || "");
  if (role === "data_entry") return [...data_entry_private_routes];
  if (role === "data_author") return [...data_author_private_routes];
  if (role === "admin") {
    const routes = [
      ...private_routes,
      ...admin_private_routes,
      ...globalAdmin_private_routes,
    ];
    if (user.addExpense) routes.push(...conditionalRoutes);
    return routes;
  }
  // restaurant_user / unknown — least privilege (dashboard-only if present)
  return data_entry_private_routes.filter((r) => r.path === "/dashboard");
}

export default function AppRoutes() {
  const user = useAppSelector((state) => state.auth?.user);
  const [routesAccess, setRoutesAccess] = useState<IRoute[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (user) {
      setRoutesAccess(routesForRole(user));
    } else {
      setRoutesAccess([]);
    }
    setLoading(false);
  }, [user]);

  return (
    <div className={user ? "app-routes app-routes--authed" : "app-routes"}>
      {loading ? (
        <CircleLoader />
      ) : (
        <Suspense fallback={<CircleLoader />}>
          <Routes>
            {public_routes.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}

            {routesAccess.map(({ path, element }, i) => (
              <Route
                key={i}
                path={path}
                element={<PrivateRoute path={path}>{element}</PrivateRoute>}
              />
            ))}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
}
