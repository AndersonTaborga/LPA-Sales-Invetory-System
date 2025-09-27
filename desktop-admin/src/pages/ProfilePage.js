import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  justify-self: start;

  &:hover:not(:disabled) {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &.danger {
    background: #ff4757;
    
    &:hover:not(:disabled) {
      background: #ff3742;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  &.success {
    background: #e8f5e8;
    color: #2ed573;
    border: 1px solid #2ed573;
  }

  &.error {
    background: #ffe8e8;
    color: #ff4757;
    border: 1px solid #ff4757;
  }
`;

const ProfileSection = styled.div`
  // Add appropriate styles for the profile section
`;

const ProfileHeader = styled.div`
  // Add appropriate styles for the profile header
`;

const Avatar = styled.div`
  // Add appropriate styles for the avatar
`;

const UserInfo = styled.div`
  // Add appropriate styles for the user info
`;

const UserName = styled.h2`
  // Add appropriate styles for the username
`;

const UserEmail = styled.p`
  // Add appropriate styles for the user email
`;

const ProfileView = styled.div`
  // Add appropriate styles for the profile view
`;

const ButtonGroup = styled.div`
  // Add appropriate styles for the button group
`;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    username: user?.username || 'john.doe',
    email: user?.email || 'john@example.com',
    fullName: 'John Doe',
    phone: '(11) 99999-9999',
    address: '123 Main Street, City, State'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would make the call to update the profile
      // await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      // Here you would make the call to change the password
      // await changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password.' });
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This is your last chance. Do you really want to delete your account?')) {
        // Here you would make the call to delete the account
        alert('Account deletion functionality will be implemented.');
      }
    }
  };

  return (
    <Container>
      <Title>My Profile</Title>

      {message.text && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}

      <ProfileSection>
        <ProfileHeader>
          <Avatar>
            {profileData.username.substring(0, 2).toUpperCase()}
          </Avatar>
          <UserInfo>
            <UserName>{profileData.fullName}</UserName>
            <UserEmail>{profileData.email}</UserEmail>
          </UserInfo>
        </ProfileHeader>

        {/* Edit Profile */}
        <Card>
          <CardTitle>Edit Profile</CardTitle>
          {!isEditing ? (
            <ProfileView>
              <InfoItem>
                <InfoLabel>Username:</InfoLabel>
                <InfoValue>{profileData.username}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Full Name:</InfoLabel>
                <InfoValue>{profileData.fullName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{profileData.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone:</InfoLabel>
                <InfoValue>{profileData.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Address:</InfoLabel>
                <InfoValue>{profileData.address}</InfoValue>
              </InfoItem>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </ProfileView>
          ) : (
            <form onSubmit={handleProfileSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                />
              </FormGroup>
              <ButtonGroup>
                <Button type="submit">Save Changes</Button>
                <Button type="button" className="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          )}
        </Card>

        {/* Change Password */}
        <Card>
          <CardTitle>Change Password</CardTitle>
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <Button type="submit">Change Password</Button>
                <Button type="button" className="secondary" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          )}
        </Card>

        {/* Delete Account */}
        <Card>
          <CardTitle>Danger Zone</CardTitle>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <Button className="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Card>
      </ProfileSection>
    </Container>
  );
} 