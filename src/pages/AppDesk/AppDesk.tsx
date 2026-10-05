import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import {
  MdQrCodeScanner,
  MdSearch,
  MdStorefront,
  MdFavorite,
  MdScience,
  MdHealthAndSafety,
  MdRestaurant,
  MdSupportAgent,
  MdStar,
  MdPeople,
  MdInventory2,
  MdTune,
  MdLocalDrink,
  MdQuiz,
  MdWorkspacePremium,
  MdPhotoCamera,
} from "react-icons/md";
import "./AppDesk.css";

const GROUPS = [
  {
    label: "What a household does in the app",
    items: [
      {
        title: "User assessment",
        copy: "Age, height, weight, diet, activity, food interest, and temporary concerns that set calorie and macro goals.",
        href: "/activity-level",
        icon: MdQuiz,
      },
      {
        title: "Daily calorie goal",
        copy: "RDA and energy libraries behind Today’s Goal on the home screen.",
        href: "/rda",
        icon: MdLocalDrink,
      },
      {
        title: "Macros & nutrients",
        copy: "Protein, carbs, fats, vitamins, and minerals shown after a scan.",
        href: "/nutrient",
        icon: MdRestaurant,
      },
      {
        title: "Barcode scan",
        copy: "Resolve unknown GTINs, pack photos, and duplicate codes before they hit the camera.",
        href: "/scans",
        icon: MdQrCodeScanner,
      },
      {
        title: "Search & filters",
        copy: "Aisle, diet, brand, serving size, and nutrient filters on Explore.",
        href: "/brands",
        icon: MdSearch,
      },
      {
        title: "Store shelf",
        copy: "The live catalog households browse after they scan or search.",
        href: "/products",
        icon: MdStorefront,
      },
    ],
  },
  {
    label: "What must be true on every label",
    items: [
      {
        title: "Ingredients",
        copy: "Dictionary mapped to allergens and intolerance before the facts panel can go live.",
        href: "/ingredients",
        icon: MdInventory2,
      },
      {
        title: "Allergens",
        copy: "Major and minor allergens flagged at scan time.",
        href: "/allergies",
        icon: MdHealthAndSafety,
      },
      {
        title: "Intolerance",
        copy: "Lactose, gluten, and the rest of the household safety profile.",
        href: "/food-intolerance",
        icon: MdHealthAndSafety,
      },
      {
        title: "Serving sizes",
        copy: "Units that turn per-serving numbers into % daily value.",
        href: "/servings",
        icon: MdTune,
      },
      {
        title: "Pack marks",
        copy: "FOPL certificates, organic, halal, and other front-of-pack claims.",
        href: "/dynamics",
        icon: MdPhotoCamera,
      },
      {
        title: "Health scores",
        copy: "The HNSS model that turns a label into the score on the product card.",
        href: "/scores",
        icon: MdStar,
      },
    ],
  },
  {
    label: "People, coaching, and the rest of the app",
    items: [
      {
        title: "Households",
        copy: "Profiles, BMI, diets, and allergies that personalize every scan.",
        href: "/users",
        icon: MdPeople,
      },
      {
        title: "Profile catalogs",
        copy: "Activity level, goal, food interest, diet, and temporary concern.",
        href: "/activity-level",
        icon: MdFavorite,
      },
      {
        title: "Talk to a nutritionist",
        copy: "Support inbox from the Talk to Nutritionist tile on the home screen.",
        href: "/contacts",
        icon: MdSupportAgent,
      },
      {
        title: "Reviews",
        copy: "Community ratings that sit under the product in search and store.",
        href: "/reviews",
        icon: MdStar,
      },
      {
        title: "Premium & quizzes",
        copy: "Push GO PREMIUM and Take 5 Min Quiz campaigns from notifications.",
        href: "/notifications",
        icon: MdWorkspacePremium,
      },
      {
        title: "Science libraries",
        copy: "Nutrients, daily values, and the food tree the catalog hangs on.",
        href: "/nutrient",
        icon: MdScience,
      },
    ],
  },
];

export default function AppDesk() {
  const navigate = useNavigate();

  return (
    <PageShell
      kicker="Live app"
      title="What the app has to handle"
      subtitle="Every surface in the Eushbi Life app — assessment, scan, search, store, safety, and coaching — maps to a library or queue here."
    >
      {GROUPS.map((group) => (
        <section key={group.label} className="app-desk__group">
          <h2 className="section-heading">{group.label}</h2>
          <div className="ops-grid">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.title} type="button" className="ops-card app-desk__card" onClick={() => navigate(item.href)}>
                  <span className="app-desk__icon">
                    <Icon size={20} />
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
