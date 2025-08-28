import { RecipeIngredient, NutritionalInfo, CostInfo } from '../types';

export const calculateNutritionalInfo = (ingredients: RecipeIngredient[]): NutritionalInfo => {
  let totalProteins = 0;
  let totalFats = 0;
  let totalCarbohydrates = 0;
  let totalCalories = 0;
  const allergens = new Set<string>();

  ingredients.forEach(({ ingredient, quantity }) => {
    if (ingredient) {
      totalProteins += (ingredient.proteins * quantity) / 100;
      totalFats += (ingredient.fats * quantity) / 100;
      totalCarbohydrates += (ingredient.carbohydrates * quantity) / 100;
      totalCalories += (ingredient.calories * quantity) / 100;
      ingredient.allergens.forEach(allergen => allergens.add(allergen));
    }
  });

  return {
    proteins: Math.round(totalProteins * 100) / 100,
    fats: Math.round(totalFats * 100) / 100,
    carbohydrates: Math.round(totalCarbohydrates * 100) / 100,
    calories: Math.round(totalCalories * 100) / 100,
    allergens: Array.from(allergens)
  };
};

export const calculateCostInfo = (ingredients: RecipeIngredient[], yieldAmount: number, markup: number = 0): CostInfo => {
  let totalCost = 0;

  ingredients.forEach(({ ingredient, quantity }) => {
    if (ingredient) {
      // Простой расчет: цена за единицу * количество
      const ingredientCost = ingredient.pricePerUnit * quantity;
      totalCost += ingredientCost;
    }
  });

  const costPerServing = yieldAmount > 0 ? totalCost / yieldAmount : 0;
  
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    costPerServing: Math.round(costPerServing * 100) / 100,
    markup: markup,
    sellingPrice: Math.round(totalCost * 100) / 100,
    grossCost: Math.round(totalCost * 100) / 100,
    netCost: Math.round(totalCost * 100) / 100
  };
};
