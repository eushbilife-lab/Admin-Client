import { useEffect, useState } from "react";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import ToasterService from "utils/toaster.util";

export default function BlockRender({ roles, children }:any) {
  const [block, setBlock] = useState(false);
  const routes = useAppSelector((state) => state.auth?.user?.role_id?.routes);

  useEffect(() => {
    if(routes.length>0){
			let private_routesCheck = routes.includes(roles)
      if(!private_routesCheck){
          setBlock(true);
      }
      
    }else{
      setBlock(true);
      AuthService.logout()
      ToasterService.showError("No privileges founded! Contact your admin.")
    }
  }, [ roles]);

  return <>{!block && children}</>;
}
// export default function BlockRender({ roles, children }:any) {
//   const [block, setBlock] = useState(false);
//   const role = useAppSelector((state) => state.auth?.user?.role);

//   useEffect(() => {
//     for (let i = 0; i < roles.length; i++) {
//       const el = roles[i];

//       if (role === el) {
//         setBlock(true);
//         break;
//       }
//     }
//   }, [role, roles]);

//   return <>{!block && children}</>;
// }
