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
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Dish, Ingredient, RecipeIngredient } from '../types';

interface DishFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (dish: Dish) => void;
  dish?: Dish;
  ingredients: Ingredient[];
}

const CATEGORY_OPTIONS = [
  'Закуски', 'Супы', 'Основные блюда', 'Гарниры', 'Салаты', 'Десерты', 'Напитки'
];

export const DishForm: React.FC<DishFormProps> = ({
  open,
  onClose,
  onSave,
  dish,
  ingredients
}) => {
  const [formData, setFormData] = useState<Partial<Dish>>({
    name: '',
    description: '',
    category: '',
    ingredients: [],
    cookingTime: 0,
    yield: 1,
    yieldUnit: 'кг',
    instructions: '',
    markup: 0
  });

  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState(0);

  useEffect(() => {
    if (dish) {
      setFormData(dish);
    } else {
              setFormData({
          name: '',
          description: '',
          category: '',
          ingredients: [],
          cookingTime: 0,
          yield: 1,
          yieldUnit: 'кг',
          instructions: '',
          markup: 0
        });
    }
  }, [dish, open]);

  const handleSave = () => {
    if (formData.name && formData.category) {
      const newDish: Dish = {
        id: dish?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description || '',
        category: formData.category,
        ingredients: formData.ingredients || [],
        cookingTime: formData.cookingTime || 0,
        yield: formData.yield || 1,
        yieldUnit: formData.yieldUnit || 'кг',
        instructions: formData.instructions || '',
        markup: formData.markup || 0,
        createdAt: dish?.createdAt || new Date(),
        updatedAt: new Date()
      };
      onSave(newDish);
      onClose();
    }
  };

  const addIngredient = () => {
    if (selectedIngredientId && ingredientQuantity > 0) {
      const ingredient = ingredients.find(i => i.id === selectedIngredientId);
      
      if (ingredient) {
        const newIngredient: RecipeIngredient = {
          ingredientId: selectedIngredientId,
          quantity: ingredientQuantity,
          ingredient
        };
        
        setFormData({
          ...formData,
          ingredients: [...(formData.ingredients || []), newIngredient]
        });
        setSelectedIngredientId('');
        setIngredientQuantity(0);
      }
    }
  };

  const updateIngredientQuantity = (index: number, newQuantity: number) => {
    const newIngredients = [...(formData.ingredients || [])];
    const currentIngredient = newIngredients[index];
    if (currentIngredient) {
      newIngredients[index] = {
        ...currentIngredient,
        quantity: newQuantity,
        ingredient: currentIngredient.ingredient // Убеждаемся, что объект ingredient сохраняется
      };
    }
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {dish ? 'Редактировать блюдо' : 'Создать новое блюдо'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название блюда"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Описание"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={2}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Категория</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            label="Категория"
            required
          >
            {CATEGORY_OPTIONS.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Ингредиенты</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ингредиент</InputLabel>
            <Select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              label="Ингредиент"
            >
              {ingredients.map(ingredient => (
                <MenuItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
                     <TextField
             label="Количество"
             type="number"
             value={ingredientQuantity}
             onChange={(e) => setIngredientQuantity(parseFloat(e.target.value) || 0)}
             sx={{ width: 120 }}
           />
          <IconButton onClick={addIngredient} color="primary">
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {(formData.ingredients || []).map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.ingredient?.name}
                                 secondary={
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                     <TextField
                       size="small"
                       type="number"
                       label="Количество"
                       value={item.quantity}
                       onChange={(e) => updateIngredientQuantity(index, parseFloat(e.target.value) || 0)}
                       sx={{ width: 120 }}
                     />
                     <Typography variant="body2" color="text.secondary">
                       {item.ingredient?.unit}
                     </Typography>
                   </Box>
                 }
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => removeIngredient(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <TextField
            label="Время приготовления (мин)"
            type="number"
            value={formData.cookingTime}
            onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
          />
          <TextField
            label="Выход"
            type="number"
            value={formData.yield}
            onChange={(e) => setFormData({ ...formData, yield: parseFloat(e.target.value) || 1 })}
          />
        </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel>Единица выхода</InputLabel>
          <Select
            value={formData.yieldUnit}
            onChange={(e) => setFormData({ ...formData, yieldUnit: e.target.value })}
            label="Единица выхода"
          >
            <MenuItem value="кг">кг</MenuItem>
            <MenuItem value="г">г</MenuItem>
            <MenuItem value="л">л</MenuItem>
            <MenuItem value="мл">мл</MenuItem>
            <MenuItem value="порция">порция</MenuItem>
            <MenuItem value="шт">шт</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Технология приготовления"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          margin="normal"
          multiline
          rows={4}
        />
        
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
