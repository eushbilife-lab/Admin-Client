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
import AuthService from "services/auth.service";

export default function AppRoutes() {
  const user = useAppSelector((state) => state.auth?.user);
  const [routesAccess, setRoutesAccess] = useState<IRoute[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    // private_routes
    if (user) {
      let private_routesCheck = [];
      if (user.role !== "data_entry")
        private_routesCheck.push(...admin_private_routes);
      if(user.role === "data_entry")
        private_routesCheck.push(...data_entry_private_routes);
      if(user.role === "data_author")
        private_routesCheck.push(...data_author_private_routes);
      if (user.role === "admin")
        private_routesCheck.push(...globalAdmin_private_routes);
      private_routesCheck.push(...private_routes);
      if (["admin"].includes(user.role) || user.addExpense) {
        private_routesCheck.push(...conditionalRoutes);
      }
      setRoutesAccess(private_routesCheck);
      setLoading(false);
    } else {
      AuthService.logout();
      setLoading(false);
    }
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
