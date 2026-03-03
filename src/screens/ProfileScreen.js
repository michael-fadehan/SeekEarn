import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

// --- Components ---

const ProfileHeader = ({ name, email, profilePic, onImagePress, isEditing, onNameChange }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.avatar} onPress={onImagePress} disabled={!isEditing}>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.avatarImage} />
      ) : (
        <Ionicons name="person" size={50} color="#fff" />
      )}
      {isEditing && (
        <View style={styles.editIconOverlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
    {isEditing ? (
      <TextInput
        style={styles.nameInput}
        value={name}
        onChangeText={onNameChange}
        autoFocus
      />
    ) : (
      <Text style={styles.name}>{name}</Text>
    )}
    <Text style={styles.email}>{email}</Text>
  </View>
);

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={24} color="#7f8c8d" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ActionButton = ({ icon, label, onPress, isDestructive = false }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={isDestructive ? '#e74c3c' : '#3498db'} />
    <Text style={[styles.actionLabel, isDestructive && { color: '#e74c3c' }]}>
      {label}
    </Text>
    <Ionicons name="chevron-forward-outline" size={24} color="#bdc3c7" />
  </TouchableOpacity>
);

const EditControls = ({ isEditing, onEdit, onSave, onCancel }) => (
  <View style={styles.editControlsContainer}>
    {!isEditing ? (
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="pencil" size={18} color="#6C5CE7" />
        <Text style={[styles.editButtonText, { color: '#6C5CE7' }]}>Edit Profile</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.editingButtons}>
        <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={onCancel}>
          <Text style={[styles.editButtonText, { color: '#2c3e50' }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.editButton, styles.saveButton]} onPress={onSave}>
          <Text style={[styles.editButtonText, { color: '#fff' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);


// --- Main Screen ---

export default function ProfileScreen({ navigation }) {
  const { disconnect, walletAddress, abbreviatedAddress } = useAuth();
  const isConnected = !!walletAddress;

  // Mock User Data
  const user = {
    memberSince: 'January 2024',
    totalPoints: 1250,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('User');
  const [profilePic, setProfilePic] = useState(null); // Initially no profile picture

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect Wallet",
      "Are you sure you want to disconnect your wallet?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Disconnect", style: "destructive", onPress: () => {
            disconnect();
            navigation.navigate('Home');
        }}
      ]
    );
  };

  const handleImagePick = async () => {
    // No permissions needed for opening image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // In a real app, you would save the new name and profile picture to your backend.
    console.log('Saved:', { name, profilePic });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset changes
    setName('User');
    setProfilePic(null); // Or reset to the original picture if there was one
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <ProfileHeader
          name={name}
          email={isConnected ? abbreviatedAddress : 'Not Connected'}
          profilePic={profilePic}
          isEditing={isEditing}
          onImagePress={handleImagePick}
          onNameChange={setName}
        />

        <EditControls
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <View style={styles.infoSection}>
          <InfoRow icon="calendar-outline" label="Member Since" value={user.memberSince} />
          <InfoRow icon="ribbon-outline" label="Total Points Earned" value={user.totalPoints.toLocaleString()} />
        </View>

        <View style={styles.actionsSection}>
          <ActionButton icon="document-text-outline" label="Terms of Service" onPress={() => Linking.openURL('https://example.com/terms')} />
          <ActionButton icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => Linking.openURL('https://example.com/privacy')} />
          <ActionButton icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
        </View>

        <View style={styles.logoutSection}>
           <ActionButton icon="log-out-outline" label="Disconnect" onPress={handleDisconnect} isDestructive />
        </View>
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
  header: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 20,
    minWidth: 150,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  editControlsContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  editButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#dfe6e9',
    borderColor: '#dfe6e9',
  },
  infoSection: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoLabel: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 15,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  actionsSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  actionLabel: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 15,
    flex: 1,
  },
  logoutSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 40,
  }
});