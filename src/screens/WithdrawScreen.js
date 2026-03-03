import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function WithdrawScreen() {
  const { walletAddress } = useAuth();
  // Mock Data - In a real app, fetch this from your backend
  const userStats = {
    dailyPoints: 450,
    allTimePoints: 25400,
    balanceUSD: 19.40, // Set above 20 to show the form state
  };
  
  const MIN_WITHDRAWAL = 20.00;
  const FEE_PERCENTAGE = 0.25;

  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [solAddress, setSolAddress] = useState('');

  useEffect(() => {
    if (walletAddress) {
      setSolAddress(walletAddress.toBase58());
    }
  }, [walletAddress]);

  const canWithdraw = userStats.balanceUSD >= MIN_WITHDRAWAL;
  
  const calculateFee = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return '0.00';
    return (val * (FEE_PERCENTAGE / 100)).toFixed(4);
  };

  const handleWithdraw = () => {
    if (!amount || !name || !email || !age || !solAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAWAL) {
       Alert.alert('Error', `Minimum withdrawal is $${MIN_WITHDRAWAL}`);
       return;
    }
    if (withdrawAmount > userStats.balanceUSD) {
        Alert.alert('Error', 'Insufficient balance');
        return;
    }

    Alert.alert('Success', 'Withdrawal request submitted!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Withdraw Earnings</Text>

        {/* Stats Card */}
        <View style={styles.statsCard}>
            <View style={styles.statRow}>
                <View>
                    <Text style={styles.statLabel}>Daily Earnings</Text>
                    <Text style={styles.statValue}>{userStats.dailyPoints} Pts</Text>
                </View>
                <View style={styles.divider} />
                <View>
                    <Text style={styles.statLabel}>All Time</Text>
                    <Text style={styles.statValue}>{userStats.allTimePoints} Pts</Text>
                </View>
            </View>
            <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>${userStats.balanceUSD.toFixed(2)}</Text>
            </View>
             {!canWithdraw && (
                <View style={styles.thresholdWarning}>
                    <Ionicons name="alert-circle" size={20} color="#e74c3c" />
                    <Text style={styles.warningText}>
                        Reach ${MIN_WITHDRAWAL} to unlock withdrawals
                    </Text>
                </View>
            )}
        </View>

        {!canWithdraw && (
          <Text style={styles.belowThresholdText}>Earnings below threshold</Text>
        )}

        {canWithdraw ? (
            <View style={styles.formContainer}>
                <Text style={styles.sectionHeader}>Request Withdrawal</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="John Doe" 
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="john@example.com" 
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="25" 
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Solana Wallet Address</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Address..." 
                        value={solAddress}
                        onChangeText={setSolAddress}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount (USD)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="0.00" 
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    <Text style={styles.feeText}>Transaction Fee: {FEE_PERCENTAGE}% (${calculateFee()})</Text>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleWithdraw}>
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
            </View>
        ) : (
             <View style={styles.lockedContainer}>
                <Ionicons name="lock-closed" size={64} color="#bdc3c7" />
                <Text style={styles.lockedText}>Keep earning to withdraw!</Text>
            </View>
        )}

        <Text style={styles.footnote}>
            * All data collected is strictly for verification purposes and to ensure compliance with our terms of service. We value your privacy.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#6C5CE7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  balanceSection: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  thresholdWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
  },
  warningText: {
    color: '#ff7675',
    marginLeft: 8,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  feeText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedContainer: {
    alignItems: 'center',
    padding: 40,
  },
  lockedText: {
    color: '#bdc3c7',
    fontSize: 18,
    marginTop: 15,
    fontWeight: '600',
  },
  belowThresholdText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footnote: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
