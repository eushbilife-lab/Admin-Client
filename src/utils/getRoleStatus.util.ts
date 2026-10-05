export const getRoleStatus = (userRole: string, status: any) => {
  if (userRole === "admin" && status === "draft") return "draft";
  if (
    userRole === "data_author" ||
    userRole === "data_entry" ||
    (userRole === "admin" && status === "pending")
  )
    return "pending";
  return status === true ? "active" : "inactive";
};
