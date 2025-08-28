import { useState, useEffect } from 'react';
import { ingredientsService, dishesService } from '../firebase/dataService';
import { Ingredient, Dish } from '../types';

export const useFirebase = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Firebase hook initialized');
    
    // Подписка на изменения ингредиентов
    const unsubscribeIngredients = ingredientsService.subscribe((data) => {
      console.log('Ingredients loaded:', data);
      setIngredients(data);
      setLoading(false);
      setError(null); // Очищаем ошибки при успешной загрузке
    });

    // Подписка на изменения блюд
    const unsubscribeDishes = dishesService.subscribe((data) => {
      console.log('Dishes loaded:', data);
      setDishes(data);
      setLoading(false);
      setError(null); // Очищаем ошибки при успешной загрузке
    });

    // Очистка подписок при размонтировании
    return () => {
      unsubscribeIngredients();
      unsubscribeDishes();
    };
  }, []);

  // Функции для работы с ингредиентами
  const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
    try {
      setError(null);
      await ingredientsService.add(ingredient);
    } catch (err: any) {
      console.error('Error adding ingredient:', err);
      setError(`Ошибка при добавлении ингредиента: ${err.message}`);
    }
  };

  const updateIngredient = async (id: string, ingredient: Partial<Ingredient>) => {
    try {
      setError(null);
      await ingredientsService.update(id, ingredient);
    } catch (err: any) {
      console.error('Error updating ingredient:', err);
      setError(`Ошибка при обновлении ингредиента: ${err.message}`);
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      setError(null);
      await ingredientsService.delete(id);
    } catch (err: any) {
      console.error('Error deleting ingredient:', err);
      setError(`Ошибка при удалении ингредиента: ${err.message}`);
    }
  };

  // Функции для работы с блюдами
  const addDish = async (dish: Omit<Dish, 'id'>) => {
    try {
      setError(null);
      await dishesService.add(dish);
    } catch (err: any) {
      console.error('Error adding dish:', err);
      setError(`Ошибка при добавлении блюда: ${err.message}`);
    }
  };

  const updateDish = async (id: string, dish: Partial<Dish>) => {
    try {
      setError(null);
      await dishesService.update(id, dish);
    } catch (err: any) {
      console.error('Error updating dish:', err);
      setError(`Ошибка при обновлении блюда: ${err.message}`);
    }
  };

  const deleteDish = async (id: string) => {
    try {
      setError(null);
      await dishesService.delete(id);
    } catch (err: any) {
      console.error('Error deleting dish:', err);
      setError(`Ошибка при удалении блюда: ${err.message}`);
    }
  };

  return {
    ingredients,
    dishes,
    loading,
    error,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addDish,
    updateDish,
    deleteDish
  };
};
