export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number; // цена за кг/л в брутто
  wastePercentage: number; // процент отхода (0-100)
  proteins: number;
  fats: number;
  carbohydrates: number;
  calories: number;
  allergens: string[];
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  ingredient?: Ingredient;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: RecipeIngredient[];
  cookingTime: number;
  yield: number;
  yieldUnit: string;
  instructions: string;
  markup: number; // наценка в процентах
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalInfo {
  proteins: number;
  fats: number;
  carbohydrates: number;
  calories: number;
  allergens: string[];
}

export interface CostInfo {
  totalCost: number;
  costPerServing: number;
  markup: number; // наценка в процентах
  sellingPrice: number; // продажная цена
  grossCost: number; // стоимость в брутто
  netCost: number; // стоимость в нетто
}
