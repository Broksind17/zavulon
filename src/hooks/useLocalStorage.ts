import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Восстанавливаем даты из строк
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            if (item.createdAt) {
              item.createdAt = new Date(item.createdAt);
            }
            if (item.updatedAt) {
              item.updatedAt = new Date(item.updatedAt);
            }
            return item;
          });
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Ошибка чтения localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Ошибка записи localStorage ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
