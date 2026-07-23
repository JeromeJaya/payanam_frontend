const MEAL_MENU = {
  VEG: {
    label: "Vegetarian",
    icon: "🥬",
    dishes: [
      { id: "veg_biryani", name: "Veg Biryani", price: 350 },
      { id: "paneer_butter", name: "Paneer Butter Masala with Naan", price: 400 },
      { id: "veg_pulao", name: "Veg Pulao with Raita", price: 300 },
      { id: "dal_khichdi", name: "Dal Khichdi", price: 250 },
      { id: "aloo_paratha", name: "Aloo Paratha with Curd", price: 280 },
      { id: "veg_fried_rice", name: "Vegetable Fried Rice", price: 320 },
      { id: "gobi_manchurian", name: "Gobi Manchurian with Rice", price: 340 },
      { id: "masala_dosa", name: "Masala Dosa with Sambhar", price: 290 },
    ],
  },
  NON_VEG: {
    label: "Non-Vegetarian",
    icon: "🍗",
    dishes: [
      { id: "chicken_biryani", name: "Chicken Biryani", price: 450 },
      { id: "butter_chicken", name: "Butter Chicken with Naan", price: 500 },
      { id: "egg_curry", name: "Egg Curry with Rice", price: 350 },
      { id: "fish_curry", name: "Fish Curry with Rice", price: 480 },
      { id: "mutton_rogan", name: "Mutton Rogan Josh", price: 550 },
      { id: "chicken_fried_rice", name: "Chicken Fried Rice", price: 400 },
      { id: "keema_pav", name: "Keema Pav", price: 380 },
      { id: "tandoori_chicken", name: "Tandoori Chicken with Roti", price: 520 },
    ],
  },
  BEVERAGES: {
    label: "Beverages",
    icon: "🥤",
    dishes: [
      { id: "water", name: "Mineral Water", price: 40 },
      { id: "cold_drink", name: "Cold Drink (Can)", price: 80 },
      { id: "juice", name: "Fresh Fruit Juice", price: 150 },
      { id: "coffee", name: "Hot Coffee", price: 120 },
      { id: "tea", name: "Hot Tea", price: 100 },
      { id: "lassi", name: "Sweet Lassi", price: 140 },
    ],
  },
  SNACKS: {
    label: "Snacks",
    icon: "🍿",
    dishes: [
      { id: "sandwich", name: "Veg Sandwich", price: 180 },
      { id: "samosa", name: "Samosa (2 pcs)", price: 100 },
      { id: "french_fries", name: "French Fries", price: 150 },
      { id: "nachos", name: "Nachos with Salsa", price: 200 },
      { id: "cake", name: "Fruit Cake Slice", price: 160 },
      { id: "chips", name: "Potato Chips", price: 60 },
    ],
  },
};

export default MEAL_MENU;
