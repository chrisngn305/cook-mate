import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  recipeId?: string;
}

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Tomatoes', quantity: 4, unit: 'pieces', isCompleted: false },
    { id: '2', name: 'Onions', quantity: 2, unit: 'pieces', isCompleted: true },
    { id: '3', name: 'Chicken breast', quantity: 500, unit: 'g', isCompleted: false },
    { id: '4', name: 'Pasta', quantity: 250, unit: 'g', isCompleted: false },
  ]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  const addItem = () => {
    if (newItem.name.trim() && newItem.quantity.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        quantity: parseFloat(newItem.quantity),
        unit: newItem.unit || 'pieces',
        isCompleted: false,
      };
      setItems([...items, item]);
      setNewItem({ name: '', quantity: '', unit: '' });
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const completedItems = items.filter(item => item.isCompleted);
  const pendingItems = items.filter(item => !item.isCompleted);

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={[styles.itemCard, item.isCompleted && styles.itemCompleted]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => toggleItem(item.id)}
      >
        <Ionicons 
          name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
          size={24} 
          color={item.isCompleted ? colors.success : colors.textSecondary} 
        />
      </TouchableOpacity>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.isCompleted && styles.itemNameCompleted]}>
          {item.name}
        </Text>
        <Text style={[styles.itemQuantity, item.isCompleted && styles.itemNameCompleted]}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <TouchableOpacity style={styles.generateButton}>
          <Ionicons name="add-circle" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Add Item */}
      <View style={styles.addContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Item name"
            placeholderTextColor={colors.inputPlaceholder}
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={[styles.input, styles.quantityInput]}
            placeholder="Qty"
            placeholderTextColor={colors.inputPlaceholder}
            value={newItem.quantity}
            onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.unitInput]}
            placeholder="Unit"
            placeholderTextColor={colors.inputPlaceholder}
            value={newItem.unit}
            onChangeText={(text) => setNewItem({ ...newItem, unit: text })}
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Ionicons name="add" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {pendingItems.length} items remaining, {completedItems.length} completed
        </Text>
      </View>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>To Buy</Text>
          <FlatList
            data={pendingItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <FlatList
            data={completedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items manually or generate from recipes
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  generateButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  nameInput: {
    flex: 2,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summary: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  itemQuantity: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 