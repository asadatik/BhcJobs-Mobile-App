import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from 'react-native';
import { registerUser, verifyPhone } from '../api/apiService';

//
const FormInput = ({ label, icon, error, ...props }) => (
  <View style={{ marginTop: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputBox, error && styles.inputError]}>
      <Text style={styles.inputIcon}>{icon}</Text>
      <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

//extractErrorMessage
const extractErrorMessage = (data) => {
  if (!data) return 'Something went wrong. Please try again.';

  if (data.error && typeof data.error === 'object' && !Array.isArray(data.error)) {
    const firstVal = Object.values(data.error)[0];
    return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
  }

  if (typeof data.error === 'string') return data.error;

  if (typeof data.message === 'string') return data.message;

  return 'Something went wrong. Please try again.';
};


const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    passport_number: '',
    dob: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep]                 = useState(1);
  const [otp, setOtp]                   = useState('');
  const [receivedOtp, setReceivedOtp]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState('');

  const set = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

 //validate
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())             e.name             = 'Full name is required';
    if (!form.phone.trim())            e.phone            = 'Phone number is required';
    if (!form.email.trim())            e.email            = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
                                       e.email            = 'Enter a valid email';
    if (!form.password.trim())         e.password         = 'Password is required';
    else if (form.password.length < 6) e.password         = 'Min 6 characters';
    if (!form.confirm_password.trim()) e.confirm_password = 'Please confirm password';
    else if (form.password !== form.confirm_password)
                                       e.confirm_password = 'Passwords do not match';
    if (!form.passport_number.trim())  e.passport_number  = 'Passport / NID is required';
    if (!form.dob.trim())              e.dob              = 'Date of birth required (YYYY-MM-DD)';
    if (!form.gender.trim())           e.gender           = 'Please select a gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

// Register User
  const handleRegister = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setApiError('');
    try {
      const response = await registerUser(form);
  

      if (response?.status !== true) {
        setApiError(extractErrorMessage(response));
        return;
      }

      const otpValue = response?.data?.otp ?? response?.data?.phone_otp ?? '';
      setReceivedOtp(String(otpValue));
      setStep(2);

    } catch (err) {
  
      setApiError(extractErrorMessage(err?.response?.data));
    } finally {
      setLoading(false);
    }
  };

  //  Verify OTP 
  const handleVerify = async () => {
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the OTP' });
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const response = await verifyPhone({ phone: form.phone, otp });


      if (response?.status !== true) {
        setApiError(extractErrorMessage(response));
        return;
      }

      Alert.alert('🎉 Success!', 'Account verified! Please login.', [
        { text: 'Login Now', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err) {
      // console.log( JSON.stringify(err?.response?.data, null, 2));
      setApiError(extractErrorMessage(err?.response?.data));
    } finally {
      setLoading(false);
    }
  };

 // OTP Verification 
  if (step === 2) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.appName}>BHC Jobs</Text>
            <Text style={styles.title}>Verify Phone 📲</Text>
            <Text style={styles.subtitle}>OTP has been sent to {form.phone}</Text>
          </View>

          <View style={styles.card}>
         
            {!!receivedOtp && (
              <View style={styles.otpHintBox}>
                <Text style={styles.otpHintLabel}>Your OTP (testing only)</Text>
                <Text style={styles.otpHintValue}>{receivedOtp}</Text>
              </View>
            )}

            {!!apiError && (
              <View style={styles.apiErrorBox}>
                <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
              </View>
            )}

            <Text style={styles.label}>Enter OTP</Text>
            <View style={[styles.inputBox, errors.otp && styles.inputError]}>
              <Text style={styles.inputIcon}>🔢</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP received"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(t) => {
                  setOtp(t);
                  if (errors.otp) setErrors({});
                  if (apiError) setApiError('');
                }}
              />
            </View>
            {!!errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Verify & Continue</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setStep(1); setApiError(''); setOtp(''); }}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={styles.link}>← Back to Registration</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  //  Registration Form 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appName}>BHC Jobs</Text>
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.card}>
          {!!apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          <FormInput label="Full Name *" icon="👤" placeholder="Enter your full name"
            value={form.name} onChangeText={set('name')} error={errors.name} />

          <FormInput label="Phone Number *" icon="📱" placeholder="e.g. 01724171556"
            keyboardType="phone-pad"
            value={form.phone} onChangeText={set('phone')} error={errors.phone} />

          <FormInput label="Email Address *" icon="✉️" placeholder="example@email.com"
            keyboardType="email-address" autoCapitalize="none"
            value={form.email} onChangeText={set('email')} error={errors.email} />

          {/* Password */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>Password *</Text>
            <View style={[styles.inputBox, errors.password && styles.inputError]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input} placeholder="Min 6 characters"
                placeholderTextColor="#94A3B8" secureTextEntry={!showPassword}
                value={form.password} onChangeText={set('password')}
              />
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={[styles.inputBox, errors.confirm_password && styles.inputError]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input} placeholder="Re-enter your password"
                placeholderTextColor="#94A3B8" secureTextEntry={!showPassword}
                value={form.confirm_password} onChangeText={set('confirm_password')}
              />
            </View>
            {!!errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password}</Text>}
          </View>

          <FormInput label="Passport / NID Number *" icon="🪪" placeholder="e.g. BD9876543"
            value={form.passport_number} onChangeText={set('passport_number')}
            error={errors.passport_number} />

          <FormInput label="Date of Birth * (YYYY-MM-DD)" icon="📅" placeholder="e.g. 2002-12-12"
            keyboardType="numeric" value={form.dob} onChangeText={set('dob')} error={errors.dob} />

          {/* Gender */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.genderRow}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                  onPress={() => set('gender')(g)}
                >
                  <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>
                    {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '⚧ Other'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {!!errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create Account</Text>
            }
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// styles
const styles = StyleSheet.create({
  container:       { flexGrow: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header:          { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  appName:         { fontSize: 28, fontWeight: 'bold', color: '#2563EB', marginBottom: 6 },
  title:           { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  subtitle:        { fontSize: 14, color: '#64748B', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  apiErrorBox: {
    backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 8,
    borderLeftWidth: 3, borderLeftColor: '#EF4444',
  },
  apiErrorText:    { color: '#DC2626', fontSize: 13 },
  otpHintBox: {
    backgroundColor: '#F0FDF4', borderRadius: 10, padding: 16,
    marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0',
  },
  otpHintLabel:    { color: '#166534', fontSize: 13, marginBottom: 6 },
  otpHintValue:    { color: '#15803D', fontSize: 34, fontWeight: 'bold', letterSpacing: 10 },
  label:           { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: '#F8FAFC',
  },
  inputError:      { borderColor: '#EF4444' },
  inputIcon:       { fontSize: 16, marginRight: 8 },
  input:           { flex: 1, paddingVertical: 13, fontSize: 15, color: '#1E293B' },
  errorText:       { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 2 },
  genderRow:       { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 10, borderWidth: 1,
    borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#F8FAFC',
  },
  genderBtnActive: { backgroundColor: '#EEF2FF', borderColor: '#2563EB' },
  genderText:      { fontSize: 12, color: '#64748B', fontWeight: '500' },
  genderTextActive:{ color: '#2563EB', fontWeight: '700' },
  btn: {
    backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 24,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  btnDisabled:     { backgroundColor: '#93C5FD' },
  btnText:         { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkRow:         { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText:        { color: '#64748B', fontSize: 14 },
  link:            { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;