import healthPrefernceReducer from "./slices/healthPrefernce";
import notificationReducer from "./slices/notification";
import level1Reducer from "./slices/level1/level1Slice";
import formLoaderReducer from "./slices/formLoader";
import { reducer as formReducer } from "redux-form";
import ingredientReducer from "./slices/ingredient";
import nutritionReducer from "./slices/nutrition";
import { combineReducers } from "redux";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import modalReducer from "./slices/modal";
import modelReducer from "./slices/model";
import loaderReducer from "./slices/loader";
import level2Reducer from "./slices/level2";
import level3Reducer from "./slices/level3";
import level4Reducer from "./slices/level4";
import rdaReducer from "./slices/rda";
import productReducer from "./slices/product";
import dynamicReducer from "./slices/dynamic";
import roleReducer from "./slices/role";
import imagesReducer from "./slices/images";
import allergiesReducer from "./slices/allergies";
import scoreCalculationReducer from "./slices/scoreCalculation";
import reviewsReducer from "./slices/Reviews";
import contactReducer from "./slices/contact";
import measurementScaleReducer from "./slices/measurementScale";
import hnssProductCategoryReducer from "./slices/hnssProductCategory";
import foodIntoleranceReducer from "./slices/foodIntolerance";
import draftProductReducer from "./slices/draftProduct";

const appReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  modal: modalReducer,
  model: modelReducer,
  loader: loaderReducer,
  formLoader: formLoaderReducer,
  notification: notificationReducer,
  level1:level1Reducer,
  level2:level2Reducer,
  level3:level3Reducer,
  level4:level4Reducer,
  rda:rdaReducer,
  product: productReducer,
  dynamic:dynamicReducer,
  role:roleReducer,
  ingredient:ingredientReducer,
  nutrition:nutritionReducer,
  healthPreference:healthPrefernceReducer,
  image:imagesReducer,
  allergy:allergiesReducer,
  scoreCalculations:scoreCalculationReducer,
  review:reviewsReducer,
  contact:contactReducer,
  measurementScale:measurementScaleReducer,
  hnssProductCategory:hnssProductCategoryReducer,
  foodIntolerance:foodIntoleranceReducer,
  draftProduct:draftProductReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") state = {};
  return appReducer(state, action);
};

export default rootReducer;
