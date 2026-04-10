import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from 'react-native';
import { loginUser } from '../api/apiService';

const parseApiError = (errData) => {
  if (!errData) return 'Something went wrong. Please try again.';

  if (errData.error && typeof errData.error === 'object' && !Array.isArray(errData.error)) {
    const firstField = Object.values(errData.error)[0];
    return Array.isArray(firstField) ? firstField[0] : String(firstField);
  }
  if (typeof errData.error === 'string') return errData.error;
  if (errData.message) return errData.message;
  return 'Something went wrong. Please try again.';
};


const LoginScreen = ({ navigation }) => {
  const [phone, setPhone]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState('');

  //Validation
  const validate = () => {
    const e = {};
    if (!phone.trim())    e.phone    = 'Phone number is required';
    if (!password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const response = await loginUser({ phone, password });
      // console.log( JSON.stringify(response, null, 2));

      if (response?.status === true) {
  
        Alert.alert('✅ Login Successful', 'Welcome back!', [
          { text: 'OK', onPress: () => navigation.replace('Home') },
        ]);
      } else {

        setApiError(parseApiError(response));
      }
    } catch (err) {
      // console.log('error:', JSON.stringify(err?.response?.data, null, 2));
      setApiError(parseApiError(err?.response?.data));
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>BHC Jobs</Text>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

   {/* Form Card */}
        <View style={styles.card}>


          {!!apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          {/* Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.inputBox, errors.phone && styles.inputError]}>
            <Text style={styles.inputIcon}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                if (apiError) setApiError('');
              }}
            />
          </View>
          {!!errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Password */}
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View style={[styles.inputBox, errors.password && styles.inputError]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                if (apiError) setApiError('');
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
              <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Login</Text>
            }
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//Styles 
const styles = StyleSheet.create({
  container:    { flexGrow: 1, backgroundColor: '#F8FAFC', padding: 20, justifyContent: 'center' },
  header:       { alignItems: 'center', marginBottom: 28 },
  appName:      { fontSize: 28, fontWeight: 'bold', color: '#2563EB', marginBottom: 8 },
  title:        { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  subtitle:     { fontSize: 14, color: '#64748B' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  apiErrorBox: {
    backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: '#EF4444',
  },
  apiErrorText: { color: '#DC2626', fontSize: 13 },
  label:        { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: '#F8FAFC',
  },
  inputError:   { borderColor: '#EF4444' },
  inputIcon:    { fontSize: 16, marginRight: 8 },
  input:        { flex: 1, paddingVertical: 13, fontSize: 15, color: '#1E293B' },
  errorText:    { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 2 },
  btn: {
    backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 24,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  btnDisabled:  { backgroundColor: '#93C5FD' },
  btnText:      { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkRow:      { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText:     { color: '#64748B', fontSize: 14 },
  link:         { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});

export default LoginScreen;