import type { Constant } from '@/stores/calculator-store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConstantsDisplayProps {
  constants: Constant[];
  userConstants: Constant[];
  isAdding: boolean;
  newConstant: { name: string; value: string; symbol: string };
  textColor: string;
  secondaryTextColor: string;
  cardBackgroundColor: string;
  accentColor: string;
  onConstantSelect: (constant: Constant) => void;
  onDeleteConstant: (id: string) => void;
  onStartAdding: () => void;
  onCancelAdding: () => void;
  onNewConstantChange: (field: 'name' | 'value' | 'symbol', value: string) => void;
  onSaveConstant: () => void;
}

export function ConstantsDisplay({
  constants,
  userConstants,
  isAdding,
  newConstant,
  textColor,
  secondaryTextColor,
  cardBackgroundColor,
  accentColor,
  onConstantSelect,
  onDeleteConstant,
  onStartAdding,
  onCancelAdding,
  onNewConstantChange,
  onSaveConstant,
}: ConstantsDisplayProps) {
  const builtIn = constants.filter(c => !c.id.startsWith('user_'));

  return (
    <View style={styles.container}>
      <View style={[styles.displayCard, { backgroundColor: cardBackgroundColor }]}>
        {isAdding ? (
          <View style={styles.addForm}>
            <Text style={[styles.formTitle, { color: textColor }]}>New Constant</Text>
            
            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>Symbol</Text>
              <TextInput
                style={[styles.input, styles.smallInput, { color: textColor, borderColor: secondaryTextColor }]}
                value={newConstant.symbol}
                onChangeText={(v) => onNewConstantChange('symbol', v)}
                placeholder="x"
                placeholderTextColor={secondaryTextColor}
                maxLength={4}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>Name</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: secondaryTextColor }]}
                value={newConstant.name}
                onChangeText={(v) => onNewConstantChange('name', v)}
                placeholder="My Constant"
                placeholderTextColor={secondaryTextColor}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={[styles.inputLabel, { color: secondaryTextColor }]}>Value</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: secondaryTextColor }]}
                value={newConstant.value}
                onChangeText={(v) => onNewConstantChange('value', v)}
                placeholder="0"
                placeholderTextColor={secondaryTextColor}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, { borderColor: secondaryTextColor }]}
                onPress={onCancelAdding}
              >
                <Text style={[styles.formButtonText, { color: secondaryTextColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton, { backgroundColor: accentColor }]}
                onPress={onSaveConstant}
              >
                <Text style={[styles.formButtonText, { color: '#FFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>
                Built-in Constants
              </Text>
              <View style={styles.constantsGrid}>
                {builtIn.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.constantChip, { borderColor: secondaryTextColor }]}
                    onPress={() => onConstantSelect(c)}
                  >
                    <Text style={[styles.constantSymbol, { color: accentColor }]}>{c.symbol}</Text>
                    <Text style={[styles.constantValue, { color: textColor }]} numberOfLines={1}>
                      {c.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>
                  My Constants
                </Text>
                <TouchableOpacity onPress={onStartAdding} style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={22} color={accentColor} />
                </TouchableOpacity>
              </View>
              
              {userConstants.length === 0 ? (
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                  Tap + to add a custom constant
                </Text>
              ) : (
                <View style={styles.constantsGrid}>
                  {userConstants.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.constantChip, styles.userChip, { borderColor: accentColor }]}
                      onPress={() => onConstantSelect(c)}
                      onLongPress={() => onDeleteConstant(c.id)}
                    >
                      <Text style={[styles.constantSymbol, { color: accentColor }]}>{c.symbol}</Text>
                      <Text style={[styles.constantValue, { color: textColor }]} numberOfLines={1}>
                        {c.value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Text style={[styles.hint, { color: secondaryTextColor }]}>
              Tap a constant to insert its value. Long-press custom constants to delete.
            </Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  displayCard: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  addButton: {
    marginBottom: 12,
  },
  constantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  constantChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  userChip: {
    borderStyle: 'dashed',
  },
  constantSymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  constantValue: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  addForm: {
    flex: 1,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  smallInput: {
    width: 80,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 0,
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
