import { lazy } from "react";

// Public Routes
const Login = lazy(() => import("pages/Login"));
const ForgotPassword = lazy(() => import("pages/ForgotPassword"));

// Product Routes
const Product = lazy(() => import("pages/Product"));
const AddProduct = lazy(() => import("pages/AddProduct"));
const UpdateProduct = lazy(() => import("pages/AddProduct"));
const UpdateDraftProduct = lazy(() => import("pages/AddProduct"));


// Level Routes
const Level1 = lazy(() => import("pages/Level1"));
const Level2 = lazy(() => import("pages/Level2"));
const Level3 = lazy(() => import("pages/Level3"));
const Level4 = lazy(() => import("pages/Level4"));
// Add Levels Routes
const AddLevel1 = lazy(() => import("pages/AddLevel1"));
const AddLevel2 = lazy(() => import("pages/AddLevel2"));
const AddLevel3 = lazy(() => import("pages/AddLevel3"));
const AddLevel4 = lazy(() => import("pages/AddLevel4"));
// Update Level Routes
const UpdateLevel1 = lazy(() => import("pages/AddLevel1"));
const UpdateLevel2 = lazy(() => import("pages/AddLevel2"));
const UpdateLevel3 = lazy(() => import("pages/AddLevel3"));
const UpdateLevel4 = lazy(() => import("pages/AddLevel4"));

// Rda Routes
const Rda = lazy(() => import("pages/AddRda"));
const Score = lazy(() => import("pages/Scores"));
const AddScores = lazy(() => import("pages/AddScore"));
const UpdateScores = lazy(() => import("pages/AddScore"));

const Nutrient = lazy(() => import("pages/Nutrition"));
const Allergy = lazy(() => import("pages/Allergies"));

const FoodIntolerance = lazy(() => import("pages/FoodIntolerance"));
// Dynamic Routes
const Dynamics = lazy(() => import("pages/AddDynamic"));
const Dashboard = lazy(() => import("pages/Dashboard"));
const MemberDetail = lazy(() => import("pages/Members"));
const DietitianQueue = lazy(() => import("pages/Queue"));
const Lifestyle = lazy(() => import("pages/Lifestyle"));
const Ingredients = lazy(() => import("pages/Ingredients"));
const Brands = lazy(() => import("pages/Brands"));
const Servings = lazy(() => import("pages/Servings"));
const ScanDesk = lazy(() => import("pages/Scans"));
const AppDesk = lazy(() => import("pages/AppDesk"));
// const UpdateDynamics = lazy(() => import("../@core/templates/AppModal/AddIngredients"));

//Role Routes
const Roles = lazy(() => import("pages/Roles"));
const AddRoles = lazy(() => import("pages/AddRole"));
const UpdateRoles = lazy(() => import("pages/AddRole"));

//Product Reviews Routes
const Reviews = lazy(() => import("pages/Reviews"));

// Users
const Users = lazy(() => import("pages/Users"));
const UpdateUsers = lazy(() => import("pages/AddUser"));

//Product Contacts Routes
const Contacts = lazy(() => import("pages/AddContactUs"));

//Product Notifications Routes
const Notifications = lazy(() => import("pages/Notifications"));

const AddNotifications = lazy(() => import("pages/AddNotifications"));

const UpdateNotifications = lazy(() => import("pages/AddNotifications"));

export { default } from "./AppRoutes";

export interface IRoute {
  path: string;
  element: JSX.Element;
}

export const conditionalRoutes: IRoute[] = [];

export const public_routes: IRoute[] = [
  { path: "/", element: <Login /> },
  { path: "forgot-password", element: <ForgotPassword /> },
];


export const private_routes: IRoute[] = [

  { path: "/dashboard", element: <Dashboard /> },
  { path: "/queue", element: <DietitianQueue /> },
  { path: "/app", element: <AppDesk /> },
  { path: "/scans", element: <ScanDesk /> },
  { path: "/lifestyle", element: <Lifestyle /> },
  { path: "/activity-level", element: <Lifestyle /> },
  { path: "/goals", element: <Lifestyle /> },
  { path: "/food-interest", element: <Lifestyle /> },
  { path: "/diets", element: <Lifestyle /> },
  { path: "/temporary-concerns", element: <Lifestyle /> },
  { path: "/products", element: <Product /> },
  { path: "/add-product", element: <AddProduct /> },
  { path: "/update-product/:id", element: <UpdateProduct /> },
  { path: "/update-draftProduct/:id", element: <UpdateDraftProduct /> },
  { path: "/ingredients", element: <Ingredients /> },
  { path: "/brands", element: <Brands /> },
  { path: "/servings", element: <Servings /> },

  { path: "/level1", element: <Level1 /> },
  { path: "/add-level1", element: <AddLevel1 /> },
  { path: "/update-level1/:id", element: <UpdateLevel1 /> },


  { path: "/level2", element: <Level2 /> },
  { path: "/add-level2", element: <AddLevel2 /> },
  { path: "/update-level2/:id", element: <UpdateLevel2 /> },


  { path: "/level3", element: <Level3 /> },
  { path: "/add-level3", element: <AddLevel3 /> },
  { path: "/update-level3/:id", element: <UpdateLevel3 /> },


  { path: "/level4", element: <Level4 /> },
  { path: "/add-level4", element: <AddLevel4 /> },
  { path: "/update-level4/:id", element: <UpdateLevel4 /> },


  { path: "/rda", element: <Rda /> },


  { path: "/nutrient", element: <Nutrient /> },


  { path: "/allergies", element: <Allergy /> },

  { path: "/food-intolerance", element: <FoodIntolerance /> },

  { path: "/dynamics", element: <Dynamics /> },
  // { path: "/update-Dynamics", element: <UpdateDynamics /> },


  { path: "/roles", element: <Roles /> },
  { path: "/add-role", element: <AddRoles /> },
  { path: "/update-role/:id", element: <UpdateRoles /> },

  
  { path: "/scores", element: <Score /> },
  { path: "/add-score", element: <AddScores /> },
  { path: "/update-score/:id", element: <UpdateScores /> },

  { path: "/reviews", element: <Reviews /> },
  { path: "/contacts", element: <Contacts /> },
  
  { path: "/users", element: <Users/> },
  { path: "/members/:id", element: <MemberDetail /> },
  { path: "/update-users/:id", element: <UpdateUsers/> },


  { path: "/notifications", element: <Notifications/> },
  { path: "/add-Notifications", element: <AddNotifications/> },
  { path: "/update-notifications/:id", element: <UpdateNotifications/> },
  
];
export const admin_private_routes: IRoute[] = [];
export const globalAdmin_private_routes: IRoute[] = [];


export const data_entry_private_routes: IRoute[] = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/products", element: <Product /> },
  { path: "/add-product", element: <AddProduct /> },
];

export const data_author_private_routes: IRoute[] = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/products", element: <Product /> },
  { path: "/add-product", element: <AddProduct /> },
  { path: "/update-product/:id", element: <UpdateProduct /> },
];
