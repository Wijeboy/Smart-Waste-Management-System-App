/**
 * UserCard Component
 * Displays user information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Get role badge color
 */
const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin':
      return '#EF4444'; // Red
    case 'collector':
      return '#3B82F6'; // Blue
    case 'user':
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * Get status badge color
 */
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'active':
      return '#10B981'; // Green
    case 'suspended':
      return '#EF4444'; // Red
    case 'pending':
      return '#F59E0B'; // Orange
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * UserCard Component
 */
const UserCard = ({ user, onPress, onEdit, onSuspend, onDelete }) => {
  const roleBadgeColor = getRoleBadgeColor(user.role);
  const statusBadgeColor = getStatusBadgeColor(user.accountStatus || 'active');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </Text>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          <View style={[styles.badge, { backgroundColor: roleBadgeColor }]}>
            <Text style={styles.badgeText}>{user.role}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusBadgeColor }]}>
            <Text style={styles.badgeText}>
              {user.accountStatus || 'active'}
            </Text>
          </View>
        </View>

        {/* Last Login */}
        {user.lastLogin && (
          <Text style={styles.lastLogin}>
            Last login: {new Date(user.lastLogin).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
        )}
        {onSuspend && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onSuspend(user);
            }}
          >
            <Text style={styles.actionIcon}>
              {user.accountStatus === 'suspended' ? '✅' : '🚫'}
            </Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(user);
            }}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  username: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  lastLogin: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
});

export default UserCard;
