import { useEffect, useState } from "react";
import { useAppSelector } from "redux/hooks";

export default function AllowRender({ roles, children }:any) {
  const [allow, setAllow] = useState(false);
//   const role = useAppSelector((state) => state.auth?.user?.role);
  const role = useAppSelector((state) => state.auth.user?.role);

  useEffect(() => {
    for (let i = 0; i < roles.length; i++) {
      const el = roles[i];

      if (role === el) {
        setAllow(true);
        break;
      }
    }
  }, [role, roles]);

  return <>{allow && children}</>;
}
