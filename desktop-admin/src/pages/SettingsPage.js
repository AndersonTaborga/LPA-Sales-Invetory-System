import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }

  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }
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

const SettingGroup = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SettingControl = styled.div`
  margin-left: 1rem;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #667eea;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #667eea;
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

  &:hover {
    background: #5a6fd8;
  }

  &.danger {
    background: #ff4757;
    
    &:hover {
      background: #ff3742;
    }
  }

  &.secondary {
    background: #f1f2f6;
    color: #333;
    
    &:hover {
      background: #ddd;
    }
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    // General settings
    language: 'en-US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    
    // Privacy
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    
    // Appearance
    theme: 'light',
    compactMode: false,
    animations: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true
  });

  useEffect(() => {
    // Load user settings
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      // Here you would make the call to load settings
      // const response = await fetch('/api/user/settings');
      // const userSettings = await response.json();
      // setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // Here you would make the call to save settings
      // await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify(settings)
      // });
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings.' });
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to restore default settings?')) {
      setSettings({
        language: 'en-US',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        profileVisibility: 'private',
        dataSharing: false,
        analytics: true,
        theme: 'light',
        compactMode: false,
        animations: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        loginAlerts: true
      });
      setMessage({ type: 'success', text: 'Settings restored to default!' });
    }
  };

  const renderGeneralSettings = () => (
    <Card>
      <CardTitle>General Settings</CardTitle>
      <SettingGroup>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Language</SettingLabel>
            <SettingDescription>Application interface language</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select 
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en-US">English (US)</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="es-ES">Español</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Time Zone</SettingLabel>
            <SettingDescription>Time zone for date display</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select 
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
            >
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Date Format</SettingLabel>
            <SettingDescription>How dates are displayed</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select 
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </SettingControl>
        </SettingItem>
      </SettingGroup>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardTitle>Notifications</CardTitle>
      <SettingGroup>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Email Notifications</SettingLabel>
            <SettingDescription>Receive important notifications by email</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Push Notifications</SettingLabel>
            <SettingDescription>Receive notifications in browser</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Marketing Emails</SettingLabel>
            <SettingDescription>Receive offers and news by email</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>
      </SettingGroup>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card>
      <CardTitle>Privacy</CardTitle>
      <SettingGroup>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Profile Visibility</SettingLabel>
            <SettingDescription>Who can see your profile</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select 
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Data Sharing</SettingLabel>
            <SettingDescription>Allow data sharing for improvements</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.dataSharing}
                onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Analytics</SettingLabel>
            <SettingDescription>Allow anonymous usage data collection</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => handleSettingChange('analytics', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>
      </SettingGroup>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card>
      <CardTitle>Security</CardTitle>
      <SettingGroup>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Two-Factor Authentication</SettingLabel>
            <SettingDescription>Add an extra layer of security</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Session Timeout</SettingLabel>
            <SettingDescription>Time in minutes for automatic logout</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select 
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Login Alerts</SettingLabel>
            <SettingDescription>Notify about new logins to account</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Toggle>
              <ToggleInput 
                type="checkbox"
                checked={settings.loginAlerts}
                onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </SettingControl>
        </SettingItem>
      </SettingGroup>
    </Card>
  );

  return (
    <Container>
      <Title>Settings</Title>

      {message.text && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}

      <TabContainer>
        <Tab 
          className={activeTab === 'general' ? 'active' : ''}
          onClick={() => setActiveTab('general')}
        >
          General
        </Tab>
        <Tab 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </Tab>
        <Tab 
          className={activeTab === 'privacy' ? 'active' : ''}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy
        </Tab>
        <Tab 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          Security
        </Tab>
      </TabContainer>

      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}
      {activeTab === 'privacy' && renderPrivacySettings()}
      {activeTab === 'security' && renderSecuritySettings()}

      <ButtonGroup>
        <Button onClick={saveSettings}>Save Settings</Button>
        <Button className="secondary" onClick={resetSettings}>Restore Default</Button>
      </ButtonGroup>
    </Container>
  );
} 