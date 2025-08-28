import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import { Ingredient, Dish } from '../types';

// Коллекции в Firestore
const INGREDIENTS_COLLECTION = 'ingredients';
const DISHES_COLLECTION = 'dishes';

// Типы для Firestore
interface FirestoreIngredient extends Omit<Ingredient, 'createdAt' | 'updatedAt'> {
  createdAt: any;
  updatedAt: any;
}

interface FirestoreDish extends Omit<Dish, 'createdAt' | 'updatedAt'> {
  createdAt: any;
  updatedAt: any;
}

// Конвертация дат
const convertDates = (data: any) => {
  if (data.createdAt) {
    data.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt) {
    data.updatedAt = data.updatedAt.toDate();
  }
  return data;
};

// Ингредиенты
export const ingredientsService = {
  // Получить все ингредиенты
  async getAll(): Promise<Ingredient[]> {
    const querySnapshot = await getDocs(collection(db, INGREDIENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertDates(doc.data())
    })) as Ingredient[];
  },

  // Добавить ингредиент
  async add(ingredient: Omit<Ingredient, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, INGREDIENTS_COLLECTION), {
      ...ingredient,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Обновить ингредиент
  async update(id: string, ingredient: Partial<Ingredient>): Promise<void> {
    const docRef = doc(db, INGREDIENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...ingredient,
      updatedAt: new Date()
    });
  },

  // Удалить ингредиент
  async delete(id: string): Promise<void> {
    const docRef = doc(db, INGREDIENTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Подписка на изменения
  subscribe(callback: (ingredients: Ingredient[]) => void, errorCallback?: (error: any) => void) {
    const q = query(collection(db, INGREDIENTS_COLLECTION), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const ingredients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertDates(doc.data())
      })) as Ingredient[];
      callback(ingredients);
    }, (error) => {
      console.error('Ingredients subscription error:', error);
      if (errorCallback) errorCallback(error);
    });
  }
};

// Блюда
export const dishesService = {
  // Получить все блюда
  async getAll(): Promise<Dish[]> {
    const querySnapshot = await getDocs(collection(db, DISHES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertDates(doc.data())
    })) as Dish[];
  },

  // Добавить блюдо
  async add(dish: Omit<Dish, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, DISHES_COLLECTION), {
      ...dish,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  // Обновить блюдо
  async update(id: string, dish: Partial<Dish>): Promise<void> {
    const docRef = doc(db, DISHES_COLLECTION, id);
    await updateDoc(docRef, {
      ...dish,
      updatedAt: new Date()
    });
  },

  // Удалить блюдо
  async delete(id: string): Promise<void> {
    const docRef = doc(db, DISHES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Подписка на изменения
  subscribe(callback: (dishes: Dish[]) => void, errorCallback?: (error: any) => void) {
    const q = query(collection(db, DISHES_COLLECTION), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const dishes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertDates(doc.data())
      })) as Dish[];
      callback(dishes);
    }, (error) => {
      console.error('Dishes subscription error:', error);
      if (errorCallback) errorCallback(error);
    });
  }
};
