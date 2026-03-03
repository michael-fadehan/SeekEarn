import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// --- Components ---

const Header = ({ isConnected, onConnect, walletAddress, onProfilePress, isConnecting }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>{isConnected ? 'Welcome back,' : 'Welcome to SeekEarn'}</Text>
      <Text style={styles.userName}>{isConnected ? walletAddress : 'Guest'}</Text>
    </View>
    {isConnected ? (
      <TouchableOpacity onPress={onProfilePress}>
        <Ionicons name="person-circle" size={42} color="#2c3e50" />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.connectButton} onPress={onConnect} disabled={isConnecting}>
        {isConnecting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.connectButtonText}>Connect</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
);

const BalanceCard = ({ points, solConversionRate, isConnected, walletBalance }) => {
  const solEquivalent = (points * solConversionRate).toFixed(4);
  
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Total Points Balance</Text>
      <Text style={styles.pointText}>{isConnected ? points.toLocaleString() : '0'}</Text>
      <Text style={styles.solText}>≈ {isConnected ? solEquivalent : '0.0000'} SOL</Text>
      
      {isConnected && (
        <View style={styles.walletInfoContainer}>
          <View style={styles.divider} />
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletValue}>{walletBalance} SOL</Text>
        </View>
      )}
      <View style={styles.cardFlare} />
    </View>
  );
};

const ActionButton = ({ text, icon, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#fff" />
    <Text style={styles.actionButtonText}>{text}</Text>
  </TouchableOpacity>
);

const StatBox = ({ icon, value, label, color }) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ReferralCard = ({ code, referralCount }) => {
  const multiplier = referralCount > 0 ? 2 : 1;

  return (
    <View style={styles.referralCard}>
      <View style={styles.referralHeader}>
        <View>
          <Text style={styles.referralTitle}>Referral Boost</Text>
          <Text style={styles.referralSubtitle}>Current Multiplier</Text>
        </View>
        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierText}>{multiplier}x</Text>
        </View>
      </View>
      
      <View style={styles.codeSection}>
        <Text style={styles.codeLabel}>Your Code</Text>
        <TouchableOpacity style={styles.codeBox}>
          <Text style={styles.codeText}>{code}</Text>
          <Ionicons name="copy-outline" size={20} color="#2c3e50" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.referralFooter}>
        Refer 1 friend to double your earnings per ad!
      </Text>
    </View>
  );
};

// --- Main Screen ---

export default function HomeScreen({ navigation }) {
  const { connect, walletAddress, isConnecting, abbreviatedAddress } = useAuth();
  const isConnected = !!walletAddress;

  // Mock data - will be replaced by API calls
  const user = {
    walletBalance: 12.45,
    points: 1250,
    referralCode: 'ASH123',
    stats: {
      today: 140,
      referrals: 3,
      pendingSOL: 0.05,
    },
  };
  const solConversionRate = 0.0001;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header 
          isConnected={isConnected}
          walletAddress={abbreviatedAddress}
          onConnect={connect}
          isConnecting={isConnecting}
          onProfilePress={() => navigation.navigate('Profile')}
        />
        
        <BalanceCard 
          points={user.points} 
          solConversionRate={solConversionRate} 
          isConnected={isConnected}
          walletBalance={user.walletBalance}
        />

        <ActionButton 
          text="Start Earning"
          icon="play-circle-outline"
          onPress={() => navigation.navigate('Earn')}
        />
        
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsContainer}>
          <StatBox 
            icon="today-outline" 
            value={user.stats.today}
            label="Today's Pts"
            color="#3498db"
          />
          <StatBox 
            icon="people-outline"
            value={user.stats.referrals}
            label="Referrals"
            color="#2ecc71"
          />
          <StatBox 
            icon="wallet-outline"
            value={user.stats.pendingSOL}
            label="Pending SOL"
            color="#f39c12"
          />
        </View>

        <ReferralCard code={user.referralCode} referralCount={user.stats.referrals} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  connectButton: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: '#6C5CE7',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    marginVertical: 20,
    overflow: 'hidden',
  },
  cardFlare: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -100,
    right: -100,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  pointText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '700',
    marginTop: 5,
  },
  solText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    marginTop: 5,
  },
  walletInfoContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    marginBottom: 15,
  },
  walletLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  walletValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#34495e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginVertical: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
  },
  referralCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  referralSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  multiplierBadge: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  multiplierText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  codeSection: {
    backgroundColor: '#f4f6f8',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 10,
  },
  referralFooter: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
});