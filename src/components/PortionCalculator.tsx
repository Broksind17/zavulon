import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import { RecipeIngredient, NutritionalInfo, CostInfo } from '../types';
import { calculateNutritionalInfo, calculateCostInfo } from '../utils/calculations';

interface PortionCalculatorProps {
  originalYield: number;
  originalIngredients: RecipeIngredient[];
  originalNutritionalInfo: NutritionalInfo;
  originalCostInfo: CostInfo;
  yieldUnit: string;
}

export const PortionCalculator: React.FC<PortionCalculatorProps> = ({
  originalYield,
  originalIngredients,
  originalNutritionalInfo,
  originalCostInfo,
  yieldUnit
}) => {
  const [targetYield, setTargetYield] = useState(originalYield);
  const [calculatedIngredients, setCalculatedIngredients] = useState<RecipeIngredient[]>([]);
  const [calculatedNutritionalInfo, setCalculatedNutritionalInfo] = useState<NutritionalInfo>(originalNutritionalInfo);
  const [calculatedCostInfo, setCalculatedCostInfo] = useState<CostInfo>(originalCostInfo);

  useEffect(() => {
    if (targetYield <= 0) return;

    // Пересчитываем количество ингредиентов
    const multiplier = targetYield / originalYield;
    const newIngredients = originalIngredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * multiplier
    }));

    setCalculatedIngredients(newIngredients);

    // Пересчитываем пищевую ценность
    const newNutritionalInfo = calculateNutritionalInfo(newIngredients);
    setCalculatedNutritionalInfo(newNutritionalInfo);

    // Пересчитываем стоимость
    const newCostInfo = calculateCostInfo(newIngredients, targetYield, 0);
    setCalculatedCostInfo(newCostInfo);
  }, [targetYield, originalYield, originalIngredients]);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Калькулятор порций
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography>Количество {yieldUnit}:</Typography>
        <TextField
          type="number"
          value={targetYield}
          onChange={(e) => setTargetYield(parseFloat(e.target.value) || 0)}
          size="small"
          sx={{ width: 120 }}
          inputProps={{ min: 0.1, step: 0.1 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Пищевая ценность (на {targetYield} {yieldUnit})
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography>Белки: {calculatedNutritionalInfo.proteins.toFixed(1)} г</Typography>
            <Typography>Жиры: {calculatedNutritionalInfo.fats.toFixed(1)} г</Typography>
            <Typography>Углеводы: {calculatedNutritionalInfo.carbohydrates.toFixed(1)} г</Typography>
            <Typography>Калории: {calculatedNutritionalInfo.calories.toFixed(0)} ккал</Typography>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Себестоимость
          </Typography>
          <Typography>Общая стоимость: {calculatedCostInfo.totalCost.toFixed(2)} zł</Typography>
          <Typography>Стоимость за {yieldUnit}: {calculatedCostInfo.costPerServing.toFixed(2)} zł</Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Ингредиенты (на {targetYield} {yieldUnit}):
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Наименование</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Цена за ед. (zł)</TableCell>
              <TableCell align="right">Стоимость (zł)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculatedIngredients.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.ingredient?.name}</TableCell>
                <TableCell align="right">
                  {item.quantity.toFixed(2)} {item.ingredient?.unit}
                </TableCell>
                <TableCell align="right">
                  {item.ingredient?.pricePerUnit} zł
                </TableCell>
                <TableCell align="right">
                  {((item.ingredient?.pricePerUnit || 0) * item.quantity).toFixed(2)} zł
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell colSpan={3}>
                <Typography variant="subtitle2">ИТОГО:</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">{calculatedCostInfo.totalCost.toFixed(2)} zł</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
