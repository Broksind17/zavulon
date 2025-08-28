import React, { useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

import { Dish } from '../types';
import { calculateNutritionalInfo, calculateCostInfo } from '../utils/calculations';
import { exportToPDF } from '../utils/pdfExport';
import { PortionCalculator } from './PortionCalculator';

interface TechnicalCardProps {
  dish: Dish;
}

export const TechnicalCard: React.FC<TechnicalCardProps> = ({ dish }) => {
  const nutritionalInfo = calculateNutritionalInfo(dish.ingredients);
  const costInfo = calculateCostInfo(dish.ingredients, dish.yield, dish.markup);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (cardRef.current) {
      await exportToPDF(cardRef.current, `тех-карта-${dish.name}`);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }} ref={cardRef}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ flex: 1 }}>
          ТЕХНИЧЕСКАЯ КАРТА
        </Typography>
        <Tooltip title="Экспорт в PDF">
          <IconButton onClick={handleExportPDF} color="primary" size="large">
            <PdfIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {dish.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {dish.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Категория: {dish.category}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Пищевая ценность (на {dish.yield} {dish.yieldUnit})
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography>Белки: {nutritionalInfo.proteins} г</Typography>
            <Typography>Жиры: {nutritionalInfo.fats} г</Typography>
            <Typography>Углеводы: {nutritionalInfo.carbohydrates} г</Typography>
            <Typography>Калории: {nutritionalInfo.calories} ккал</Typography>
          </Box>
        </Box>
                 <Box>
           <Typography variant="h6" gutterBottom>
             Себестоимость
           </Typography>
           <Typography>Общая стоимость: {costInfo.totalCost} zł</Typography>
           <Typography>Стоимость за {dish.yieldUnit}: {costInfo.costPerServing} zł</Typography>
           <Typography>Время приготовления: {dish.cookingTime} мин</Typography>
         </Box>
      </Box>

      {nutritionalInfo.allergens.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Аллергены:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {nutritionalInfo.allergens.map(allergen => (
              <Chip key={allergen} label={allergen} color="warning" size="small" />
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Ингредиенты:
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
            {dish.ingredients.map((item, index) => (
                                          <TableRow key={index}>
               <TableCell>{item.ingredient?.name}</TableCell>
               <TableCell align="right">
                 {item.quantity} {item.ingredient?.unit}
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
                 <Typography variant="subtitle2">{costInfo.totalCost} zł</Typography>
               </TableCell>
             </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Технология приготовления:
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {dish.instructions}
        </Typography>
      </Box>

             <Box sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
         <Typography variant="caption">
           Дата создания: {dish.createdAt.toLocaleDateString('ru-RU')}
         </Typography>
       </Box>

       <PortionCalculator
         originalYield={dish.yield}
         originalIngredients={dish.ingredients}
         originalNutritionalInfo={nutritionalInfo}
         originalCostInfo={costInfo}
         yieldUnit={dish.yieldUnit}
       />
     </Paper>
   );
 };
