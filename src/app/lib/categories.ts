// src/app/lib/categories.ts
// Maps human-friendly category names (used in the UI) to the
// granular dummyjson category slugs that actually live on products.

export const CATEGORY_GROUPS: Record<string, string[]> = {
  electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories",
  ],
  fashion: [
    "mens-shirts",
    "mens-shoes",
    "womens-dresses",
    "womens-shoes",
    "tops",
  ],
  home: [
    "furniture",
    "home-decoration",
    "kitchen-accessories",
  ],
  beauty: [
    "beauty",
    "fragrances",
    "skin-care",
  ],
  sports: ["sports-accessories"],
  accessories: [
    "mens-watches",
    "womens-watches",
    "womens-jewellery",
    "womens-bags",
    "sunglasses",
  ],
  groceries: ["groceries"],
  automotive: ["motorcycle", "vehicle"],
};

/** Resolve a UI category key (e.g. "electronics") to its slug list. */
export function resolveCategory(key: string | null | undefined): string[] | null {
  if (!key) return null;
  const slugs = CATEGORY_GROUPS[key.toLowerCase()];
  return slugs ?? [key.toLowerCase()]; // fall back to literal match
}

/** Display labels for the nav. */
export const NAV_CATEGORIES: { slug: string; label: string }[] = [
  { slug: "electronics", label: "Electronics" },
  { slug: "fashion", label: "Fashion" },
  { slug: "home", label: "Home & Kitchen" },
  { slug: "beauty", label: "Beauty" },
  { slug: "sports", label: "Sports" },
  { slug: "accessories", label: "Accessories" },
  { slug: "groceries", label: "Groceries" },
];