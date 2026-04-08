import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { registerUser, verifyPhone } from '../api/apiService';

const RegisterScreen = ({ navigation }) => {
  //Registration
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //OTP
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // validateStep
  const validateStep1 = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim())
      newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleRegister
  const handleRegister = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setApiError('');
    try {
      const response = await registerUser({ name, phone, password });
  
      const otpFromResponse =
        response?.otp ||
        response?.data?.otp ||
        response?.data?.phone_otp ||
        '';
      setReceivedOtp(otpFromResponse.toString());
      setStep(2);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

 
  const handleVerify = async () => {
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the OTP' });
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await verifyPhone({ phone, otp });
      Alert.alert('Success!', 'Account verified! Please login.', [
        { text: 'Login Now', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'OTP verification failed.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  //OTP Screen
  if (step === 2) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.appName}>BHC Jobs</Text>
            <Text style={styles.title}>Verify Phone 📲</Text>
            <Text style={styles.subtitle}>
              Enter the OTP sent to {phone}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Show OTP for testing */}
            {!!receivedOtp && (
              <View style={styles.otpHintBox}>
                <Text style={styles.otpHintText}>
                  🔐 Your OTP (for testing): {receivedOtp}
                </Text>
              </View>
            )}

            {!!apiError && (
              <View style={styles.apiErrorBox}>
                <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
              </View>
            )}

            <Text style={styles.label}>Enter OTP</Text>
            <View
              style={[
                styles.inputBox,
                errors.otp && styles.inputError,
              ]}
            >
              <Text style={styles.inputIcon}>🔢</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  if (errors.otp) setErrors({});
                }}
              />
            </View>
            {!!errors.otp && (
              <Text style={styles.errorText}>{errors.otp}</Text>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep(1)}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={styles.link}>← Back to Registration</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  //Registration Form
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.appName}>BHC Jobs</Text>
          <Text style={styles.title}>Create Account 🚀</Text>
          <Text style={styles.subtitle}>Join thousands of job seekers</Text>
        </View>

        <View style={styles.card}>
          {!!apiError && (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>⚠️ {apiError}</Text>
            </View>
          )}

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={[styles.inputBox, errors.name && styles.inputError]}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
            />
          </View>
          {!!errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

     
          <Text style={[styles.label, { marginTop: 14 }]}>Phone Number</Text>
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
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
            />
          </View>
          {!!errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}

          
          <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
          <View
            style={[styles.inputBox, errors.password && styles.inputError]}
          >
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.inputIcon}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
          {!!errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

    
          <Text style={[styles.label, { marginTop: 14 }]}>
            Confirm Password
          </Text>
          <View
            style={[
              styles.inputBox,
              errors.confirmPassword && styles.inputError,
            ]}
          >
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: '' });
              }}
            />
          </View>
          {!!errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  apiErrorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  apiErrorText: {
    color: '#DC2626',
    fontSize: 13,
  },
  otpHintBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },
  otpHintText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1E293B',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  btn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: '#93C5FD',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#64748B',
    fontSize: 14,
  },
  link: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;