import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getCompanyImageUrl } from '../api/apiService';

const JobCard = ({ item }) => {
  const imageUrl = getCompanyImageUrl(item?.image || item?.company_image);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.logoContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>
              {item?.company_name?.charAt(0) || item?.title?.charAt(0) || 'J'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item?.title || item?.job_title || 'Job Title'}
        </Text>
        <Text style={styles.company} numberOfLines={1}>
          {item?.company_name || 'Company'}
        </Text>
        <View style={styles.row}>
          <Text style={styles.location} numberOfLines={1}>
            📍 {item?.location || item?.district || 'Bangladesh'}
          </Text>
          {item?.job_type && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.job_type}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logoContainer: {
    marginRight: 14,
    justifyContent: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 3,
  },
  company: {
    fontSize: 13,
    color: '#2563EB',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default JobCard;