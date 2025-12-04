import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItem } from '@/types';

interface MenuButtonsProps {
  items: MenuItem[];
  onSelect: (option: string) => void;
}

export function MenuButtons({ items, onSelect }: MenuButtonsProps) {
  // Sort items by option_number to ensure correct order
  const sortedItems = [...items].sort((a, b) => a.option_number - b.option_number);

  return (
    <View style={styles.container}>
      {sortedItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.button}
          onPress={() => onSelect(item.option_number.toString())}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>
            {item.option_number}. {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    backgroundColor: '#11486b', // Dark teal - primary color
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

