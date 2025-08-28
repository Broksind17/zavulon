import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Dialog,
  IconButton,
  Chip
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { IngredientForm } from './components/IngredientForm';
import { DishForm } from './components/DishForm';
import { TechnicalCard } from './components/TechnicalCard';
import { SearchBar } from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { filterIngredients, filterDishes, sortDishes } from './utils/filtering';

import { Ingredient, Dish } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>('ingredients', []);
  const [dishes, setDishes] = useLocalStorage<Dish[]>('dishes', []);
  const [tabValue, setTabValue] = useState(0);
  const [ingredientFormOpen, setIngredientFormOpen] = useState(false);
  const [dishFormOpen, setDishFormOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>();
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>();
  const [viewDish, setViewDish] = useState<Dish | undefined>();
  const [technicalCardOpen, setTechnicalCardOpen] = useState(false);
  
  // Состояние для поиска и фильтрации
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [dishSearchTerm, setDishSearchTerm] = useState('');
  const [dishCategoryFilter, setDishCategoryFilter] = useState('');
  const [dishSortBy, setDishSortBy] = useState<'name' | 'category' | 'cost' | 'date'>('name');
  const [dishSortOrder, setDishSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleIngredientSave = (ingredient: Ingredient) => {
    if (selectedIngredient) {
      setIngredients(prev => prev.map(i => i.id === ingredient.id ? ingredient : i));
      // Обновляем ингредиенты в блюдах при изменении цены
      setDishes(prev => prev.map(dish => ({
        ...dish,
        ingredients: dish.ingredients.map(recipeIngredient =>
          recipeIngredient.ingredientId === ingredient.id
            ? { ...recipeIngredient, ingredient }
            : recipeIngredient
        )
      })));

    } else {
      setIngredients(prev => [...prev, ingredient]);
    }
    setSelectedIngredient(undefined);
  };

  const handleDishSave = (dish: Dish) => {
    if (selectedDish) {
      setDishes(prev => prev.map(d => d.id === dish.id ? dish : d));
    } else {
      setDishes(prev => [...prev, dish]);
    }
    setSelectedDish(undefined);
  };

  const handleIngredientDelete = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const handleDishDelete = (id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  const handleExportPDF = async (dish: Dish) => {
    setViewDish(dish);
    setTechnicalCardOpen(true);
  };

  // Получение уникальных категорий блюд
  const dishCategories = Array.from(new Set(dishes.map(dish => dish.category)));

  // Фильтрация и сортировка данных
  const filteredIngredients = filterIngredients(ingredients, ingredientSearchTerm);
  const filteredDishes = filterDishes(dishes, dishSearchTerm, dishCategoryFilter);
  const sortedDishes = sortDishes(filteredDishes, dishSortBy, dishSortOrder);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Система технических карт блюд
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Ингредиенты" />
          <Tab label="Блюда" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Ингредиенты</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIngredientFormOpen(true)}
          >
            Добавить ингредиент
          </Button>
        </Box>

        <SearchBar
          searchTerm={ingredientSearchTerm}
          onSearchChange={setIngredientSearchTerm}
          categoryFilter=""
          onCategoryChange={() => {}}
          categories={[]}
          placeholder="Поиск ингредиентов..."
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filteredIngredients.map(ingredient => (
            <Card key={ingredient.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ingredient.name}
                </Typography>
                                  <Typography variant="body2" color="text.secondary">
                    Цена: {ingredient.pricePerUnit} zł/{ingredient.unit} (брутто)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Отход: {ingredient.wastePercentage}%
                  </Typography>
                <Typography variant="body2">
                  БЖУ: {ingredient.proteins}/{ingredient.fats}/{ingredient.carbohydrates} г
                </Typography>
                <Typography variant="body2">
                  Калории: {ingredient.calories} ккал
                </Typography>
                {ingredient.allergens.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {ingredient.allergens.map(allergen => (
                      <Chip key={allergen} label={allergen} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedIngredient(ingredient);
                    setIngredientFormOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleIngredientDelete(ingredient.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Блюда</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDishFormOpen(true)}
            disabled={ingredients.length === 0}
          >
            Создать блюдо
          </Button>
        </Box>

        <SearchBar
          searchTerm={dishSearchTerm}
          onSearchChange={setDishSearchTerm}
          categoryFilter={dishCategoryFilter}
          onCategoryChange={setDishCategoryFilter}
          categories={dishCategories}
          placeholder="Поиск блюд..."
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {sortedDishes.map(dish => (
            <Card key={dish.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {dish.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {dish.description}
                </Typography>
                <Typography variant="body2">
                  Категория: {dish.category}
                </Typography>
                <Typography variant="body2">
                  Выход: {dish.yield} {dish.yieldUnit}
                </Typography>
                <Typography variant="body2">
                  Время: {dish.cookingTime} мин
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => {
                    setViewDish(dish);
                    setTechnicalCardOpen(true);
                  }}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleExportPDF(dish)}
                >
                  <PdfIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedDish(dish);
                    setDishFormOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDishDelete(dish.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <IngredientForm
        open={ingredientFormOpen}
        onClose={() => {
          setIngredientFormOpen(false);
          setSelectedIngredient(undefined);
        }}
        onSave={handleIngredientSave}
        ingredient={selectedIngredient}
      />

      <DishForm
        open={dishFormOpen}
        onClose={() => {
          setDishFormOpen(false);
          setSelectedDish(undefined);
        }}
        onSave={handleDishSave}
        dish={selectedDish}
        ingredients={ingredients}
      />

      <Dialog
        open={technicalCardOpen}
        onClose={() => setTechnicalCardOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {viewDish && (
          <div id="technical-card">
            <TechnicalCard dish={viewDish} />
          </div>
        )}
      </Dialog>
    </Container>
  );
}

export default App;
