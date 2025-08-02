import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { 
  useShoppingLists, 
  useCreateShoppingList, 
  useAddShoppingListItem,
  useToggleShoppingListItem,
  useDeleteShoppingListItem,
  useDeleteShoppingList
} from '../services/hooks';

export default function ShoppingListScreen() {
  const navigation = useNavigation<any>();
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Fetch shopping lists from API
  const { data: shoppingLists = [], isLoading } = useShoppingLists();
  const createListMutation = useCreateShoppingList();
  const addItemMutation = useAddShoppingListItem();
  const toggleItemMutation = useToggleShoppingListItem();
  const deleteItemMutation = useDeleteShoppingListItem();
  const deleteListMutation = useDeleteShoppingList();

  // Get the first list or create a default one
  const currentList = shoppingLists.length > 0 ? shoppingLists[0] : null;
  const items = currentList?.items || [];

  const addItem = async () => {
    if (!currentList) {
      // Create a new list if none exists
      try {
        const newList = await createListMutation.mutateAsync({
          name: 'My Shopping List',
          isCompleted: false
        });
        setSelectedListId(newList.id);
      } catch (error) {
        Alert.alert('Error', 'Failed to create shopping list. Please try again.');
        return;
      }
    }

    if (newItem.name.trim() && newItem.quantity.trim()) {
      try {
        await addItemMutation.mutateAsync({
          listId: currentList?.id || selectedListId!,
          item: {
            name: newItem.name.trim(),
            quantity: parseFloat(newItem.quantity),
            unit: newItem.unit || 'pieces',
            isCompleted: false,
          }
        });
        setNewItem({ name: '', quantity: '', unit: '' });
      } catch (error) {
        Alert.alert('Error', 'Failed to add item. Please try again.');
      }
    }
  };

  const toggleItem = async (itemId: string) => {
    if (!currentList) return;
    
    try {
      await toggleItemMutation.mutateAsync({
        listId: currentList.id,
        itemId: itemId
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!currentList) return;
    
    try {
      await deleteItemMutation.mutateAsync({
        listId: currentList.id,
        itemId: itemId
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item. Please try again.');
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await deleteListMutation.mutateAsync(listId);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete shopping list. Please try again.');
    }
  };

  const completedItems = items.filter(item => item.isCompleted);
  const pendingItems = items.filter(item => !item.isCompleted);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemCard, item.isCompleted && styles.itemCompleted]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => toggleItem(item.id)}
        disabled={toggleItemMutation.isPending}
      >
        {toggleItemMutation.isPending ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons 
            name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
            size={24} 
            color={item.isCompleted ? colors.success : colors.textSecondary} 
          />
        )}
      </TouchableOpacity>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.isCompleted && styles.itemNameCompleted]}>
          {item.name}
        </Text>
        <Text style={[styles.itemQuantity, item.isCompleted && styles.itemNameCompleted]}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => removeItem(item.id)}
        disabled={deleteItemMutation.isPending}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading shopping lists...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add items manually or generate from recipes
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => {
            // TODO: Implement generate from recipes functionality
            Alert.alert('Coming Soon', 'Generate shopping list from recipes feature will be available soon!');
          }}
        >
          <Ionicons name="add-circle" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
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
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addItem}
                disabled={addItemMutation.isPending}
              >
                {addItemMutation.isPending ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Ionicons name="add" size={20} color={colors.surface} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary */}
          {items.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {pendingItems.length} items remaining, {completedItems.length} completed
              </Text>
            </View>
          )}

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
          {items.length === 0 && !isLoading && renderEmptyState()}
        </>
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
    fontSize: 16,
    lineHeight: 20,
    color: colors.text,
    minHeight: 40,
    textAlignVertical: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
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