import AuthService from "services/auth.service";

export { default } from "./Header";
export interface ILink {
  to?: string;
  text?: any;
  active?: string;
  options?: any[];
  role?: string;
  onClick?:()=>void
}
export const adminLinks: ILink[] = [
  { to: "/products", text: "Products", active: "product" },
  {
    text:"Levels",
    options: [
      { to: "/level1", text: "Level 1", active: "level1" },
      { to: "/level2", text: "Level 2", active: "level2" },
      { to: "/level3", text: "Level 3", active: "level3" },
      { to: "/level4", text: "Level 4", active: "level4" }
    ]
  },
  { to: "/rda", text: "RDA", active: "rda" },
  { to: "/users", text: "Users", active: "users" },
  { to: "/dynamics", text: "Dynamics", active: "dynamics" },
  { to: "/roles", text: "Roles", active: "roles" },
];
export const adminHeaderLinks: ILink[] = [
  { to: "/food-intolerance", text: "Food Intolerance", active: "food-intolerance" },
  { to: "/allergies", text: "Allergies", active: "allergies" },
  { to: "/nutrient", text: "Nutrients", active: "nutrients" },
  { to: "/reviews", text: "Reviews", active: "reviews" },
  { to: "/scores", text: "Scores", active: "scores" },
  { to: "/contacts", text: "Support", active: "contacts" },
  { to: "/notifications", text: "Notifications", active: "notifications" },
  { text: "Logout", onClick: () => AuthService.logout() }, 
];

export const BasicHeaderLinks: ILink[] = [
  { text: "Logout", onClick: () => AuthService.logout() },
];