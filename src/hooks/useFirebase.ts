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
    }, (error) => {
      console.error('Ingredients subscription error:', error);
      setError('Ошибка загрузки ингредиентов');
      setLoading(false);
    });

    // Подписка на изменения блюд
    const unsubscribeDishes = dishesService.subscribe((data) => {
      console.log('Dishes loaded:', data);
      setDishes(data);
      setLoading(false);
    }, (error) => {
      console.error('Dishes subscription error:', error);
      setError('Ошибка загрузки блюд');
      setLoading(false);
    });

    // Обработка ошибок
    const handleError = (err: any) => {
      console.error('Firebase error:', err);
      setError('Ошибка подключения к базе данных');
      setLoading(false);
    };

    // Очистка подписок при размонтировании
    return () => {
      unsubscribeIngredients();
      unsubscribeDishes();
    };
  }, []);

  // Функции для работы с ингредиентами
  const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
    try {
      await ingredientsService.add(ingredient);
    } catch (err) {
      handleError(err);
    }
  };

  const updateIngredient = async (id: string, ingredient: Partial<Ingredient>) => {
    try {
      await ingredientsService.update(id, ingredient);
    } catch (err) {
      handleError(err);
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      await ingredientsService.delete(id);
    } catch (err) {
      handleError(err);
    }
  };

  // Функции для работы с блюдами
  const addDish = async (dish: Omit<Dish, 'id'>) => {
    try {
      await dishesService.add(dish);
    } catch (err) {
      handleError(err);
    }
  };

  const updateDish = async (id: string, dish: Partial<Dish>) => {
    try {
      await dishesService.update(id, dish);
    } catch (err) {
      handleError(err);
    }
  };

  const deleteDish = async (id: string) => {
    try {
      await dishesService.delete(id);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: any) => {
    console.error('Firebase error:', err);
    setError('Ошибка подключения к базе данных');
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
