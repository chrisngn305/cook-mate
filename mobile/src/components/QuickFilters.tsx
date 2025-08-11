import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

interface QuickFiltersProps {
  selectedFilters: string[];
  onFilterPress: (filterId: string) => void;
  onClearFilters: () => void;
}

const quickFilters = [
  { id: 'easy', label: 'Easy to Cook', icon: 'checkmark-circle' },
  { id: 'short', label: 'Quick (< 30min)', icon: 'time' },
  { id: 'cold', label: 'Cold Day', icon: 'snow' },
  { id: 'party', label: 'Party', icon: 'people' },
];

export default function QuickFilters({
  selectedFilters,
  onFilterPress,
  onClearFilters,
}: QuickFiltersProps) {
  return (
    <View style={styles.section}>
      <View style={styles.filterHeader}>
        <Text style={styles.sectionTitle}>Quick Filters</Text>
        {selectedFilters.length > 0 && (
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={onClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          {quickFilters.map((filter) => {
            const isSelected = selectedFilters.includes(filter.id);
            return (
              <TouchableOpacity 
                key={filter.id} 
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected
                ]}
                onPress={() => onFilterPress(filter.id)}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={16} 
                  color={isSelected ? colors.surface : colors.primary} 
                />
                <Text style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  clearFiltersButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  clearFiltersText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTextSelected: {
    color: colors.surface,
  },
}); 