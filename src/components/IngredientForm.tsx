import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { Ingredient } from '../types';

interface IngredientFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  ingredient?: Ingredient;
}

const ALLERGEN_OPTIONS = [
  'Глютен', 'Лактоза', 'Яйца', 'Рыба', 'Моллюски', 'Орехи', 'Арахис', 'Соя'
];

const UNIT_OPTIONS = ['г', 'кг', 'мл', 'л', 'шт', 'ст.л', 'ч.л'];

export const IngredientForm: React.FC<IngredientFormProps> = ({
  open,
  onClose,
  onSave,
  ingredient
}) => {
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    name: '',
    unit: 'г',
    pricePerUnit: 0,
    wastePercentage: 0,
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    calories: 0,
    allergens: []
  });

  useEffect(() => {
    if (ingredient) {
      setFormData(ingredient);
    } else {
              setFormData({
          name: '',
          unit: 'г',
          pricePerUnit: 0,
          wastePercentage: 0,
          proteins: 0,
          fats: 0,
          carbohydrates: 0,
          calories: 0,
          allergens: []
        });
    }
  }, [ingredient, open]);

  const handleSave = () => {
    if (formData.name && formData.unit) {
      const newIngredient: Ingredient = {
        id: ingredient?.id || Date.now().toString(),
        name: formData.name,
        unit: formData.unit,
        pricePerUnit: formData.pricePerUnit || 0,
        wastePercentage: formData.wastePercentage || 0,
        proteins: formData.proteins || 0,
        fats: formData.fats || 0,
        carbohydrates: formData.carbohydrates || 0,
        calories: formData.calories || 0,
        allergens: formData.allergens || []
      };
      onSave(newIngredient);
      onClose();
    }
  };

  const handleAllergenToggle = (allergen: string) => {
    const currentAllergens = formData.allergens || [];
    const newAllergens = currentAllergens.includes(allergen)
      ? currentAllergens.filter(a => a !== allergen)
      : [...currentAllergens, allergen];
    setFormData({ ...formData, allergens: newAllergens });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {ingredient ? 'Редактировать ингредиент' : 'Добавить ингредиент'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Единица измерения</InputLabel>
          <Select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            label="Единица измерения"
          >
            {UNIT_OPTIONS.map(unit => (
              <MenuItem key={unit} value={unit}>{unit}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Цена за единицу (zł) - брутто"
          type="number"
          value={formData.pricePerUnit}
          onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Процент отхода (%)"
          type="number"
          value={formData.wastePercentage}
          onChange={(e) => setFormData({ ...formData, wastePercentage: parseFloat(e.target.value) || 0 })}
          margin="normal"
          helperText="Например: 20% отхода означает, что из 1кг брутто получается 0.8кг нетто"
        />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Пищевая ценность (на 100г/мл)</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Белки (г)"
            type="number"
            value={formData.proteins}
            onChange={(e) => setFormData({ ...formData, proteins: parseFloat(e.target.value) || 0 })}
          />
          <TextField
            label="Жиры (г)"
            type="number"
            value={formData.fats}
            onChange={(e) => setFormData({ ...formData, fats: parseFloat(e.target.value) || 0 })}
          />
          <TextField
            label="Углеводы (г)"
            type="number"
            value={formData.carbohydrates}
            onChange={(e) => setFormData({ ...formData, carbohydrates: parseFloat(e.target.value) || 0 })}
          />
          <TextField
            label="Калории (ккал)"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Аллергены</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ALLERGEN_OPTIONS.map(allergen => (
            <Chip
              key={allergen}
              label={allergen}
              onClick={() => handleAllergenToggle(allergen)}
              color={formData.allergens?.includes(allergen) ? 'primary' : 'default'}
              variant={formData.allergens?.includes(allergen) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
