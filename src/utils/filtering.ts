import { Ingredient, Dish } from '../types';

export const filterIngredients = (
  ingredients: Ingredient[],
  searchTerm: string
): Ingredient[] => {
  if (!searchTerm.trim()) return ingredients;
  
  const term = searchTerm.toLowerCase();
  return ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(term) ||
    ingredient.unit.toLowerCase().includes(term)
  );
};

export const filterDishes = (
  dishes: Dish[],
  searchTerm: string,
  categoryFilter: string
): Dish[] => {
  let filtered = dishes;

  // Фильтр по поисковому запросу
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(dish =>
      dish.name.toLowerCase().includes(term) ||
      dish.description.toLowerCase().includes(term) ||
      dish.category.toLowerCase().includes(term)
    );
  }

  // Фильтр по категории
  if (categoryFilter) {
    filtered = filtered.filter(dish => dish.category === categoryFilter);
  }

  return filtered;
};

export const sortDishes = (
  dishes: Dish[],
  sortBy: 'name' | 'category' | 'cost' | 'date' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Dish[] => {
  const sorted = [...dishes];

  sorted.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'cost':
        // Вычисляем стоимость блюда
        aValue = a.ingredients.reduce((sum, item) => 
          sum + (item.ingredient?.pricePerUnit || 0) * item.quantity, 0);
        bValue = b.ingredients.reduce((sum, item) => 
          sum + (item.ingredient?.pricePerUnit || 0) * item.quantity, 0);
        break;
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};
