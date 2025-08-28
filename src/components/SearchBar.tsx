import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  placeholder = "Поиск..."
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        size="small"
      />
      
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Категория</InputLabel>
        <Select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          label="Категория"
        >
          <MenuItem value="">Все категории</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
