import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { getIndustries, getJobs, getCompanies } from '../api/apiService';
import IndustryCard from '../components/IndustryCard';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';

const HomeScreen = ({ navigation }) => {
  const [industries, setIndustries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [industriesRes, jobsRes, companiesRes] = await Promise.all([
        getIndustries(),
        getJobs(),
        getCompanies(),
      ]);

      // Handle various API response structures
      setIndustries(
        industriesRes?.data || industriesRes?.industries || industriesRes || []
      );
      setJobs(
        jobsRes?.data || jobsRes?.jobs || jobsRes || []
      );
      setCompanies(
        companiesRes?.data || companiesRes?.companies || companiesRes || []
      );
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load data. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title, onPress }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchAllData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HERO SECTION ===== */}
        <View style={styles.hero}>
          <Text style={styles.appName}>BHC Jobs</Text>
          <Text style={styles.tagline}>Find Your Dream Job Today</Text>
          <Text style={styles.subTagline}>
            Thousands of jobs waiting for you
          </Text>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, companies..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerBtnText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== POPULAR INDUSTRIES ===== */}
        <View style={styles.section}>
          <SectionHeader title="Popular Industries" />
          {industries.length > 0 ? (
            <FlatList
              data={industries.slice(0, 10)}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={({ item }) => <IndustryCard item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            />
          ) : (
            <Text style={styles.emptyText}>No industries found.</Text>
          )}
        </View>

        {/* ===== RECOMMENDED JOBS ===== */}
        <View style={styles.section}>
          <SectionHeader title="Recommended Jobs" />
          {jobs.length > 0 ? (
            jobs.slice(0, 6).map((item, index) => (
              <JobCard
                key={item?.id?.toString() || index.toString()}
                item={item}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No jobs found.</Text>
          )}
        </View>

        {/* ===== POPULAR COMPANIES ===== */}
        <View style={styles.section}>
          <SectionHeader title="Popular Companies" />
          {companies.length > 0 ? (
            <FlatList
              data={companies.slice(0, 10)}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={({ item }) => <CompanyCard item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            />
          ) : (
            <Text style={styles.emptyText}>No companies found.</Text>
          )}
        </View>

        {/* ===== BOTTOM CTA ===== */}
        <View style={styles.bottomCTA}>
          <Text style={styles.ctaText}>Ready to find your next job?</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.ctaBtnText}>Get Started Free</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2563EB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Hero
  hero: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 20,
    color: '#DBEAFE',
    fontWeight: '600',
    marginBottom: 4,
  },
  subTagline: {
    fontSize: 14,
    color: '#93C5FD',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 10,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 15,
  },
  registerBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAll: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },

  // Bottom CTA
  bottomCTA: {
    backgroundColor: '#EEF2FF',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 14,
    textAlign: 'center',
  },
  ctaBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;