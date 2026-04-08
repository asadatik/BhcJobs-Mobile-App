import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getCompanyImageUrl } from '../api/apiService';

const CompanyCard = ({ item }) => {
  const imageUrl = getCompanyImageUrl(item?.image);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>
            {item?.name?.charAt(0) || 'C'}
          </Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {item?.name || 'Company'}
      </Text>
      {item?.job_count !== undefined && (
        <Text style={styles.jobCount}>{item.job_count} Jobs</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 110,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#EEF2FF',
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  name: {
    fontSize: 12,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  jobCount: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default CompanyCard;