import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 400px;
  padding: 32px 24px;
  text-align: center;
`;

const Logo = styled.div`
  background: #111;
  border-radius: 16px 16px 80px 80px;
  height: 80px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-bottom: 16px;
  font-weight: 600;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  color: #667eea;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;

  &.error {
    color: #ff4757;
    background: #ffe8e8;
    border: 1px solid #ff4757;
  }

  &.success {
    color: #2ed573;
    background: #e8f5e8;
    border: 1px solid #2ed573;
  }

  &.warning {
    color: #ffa502;
    background: #fff3e0;
    border: 1px solid #ffa502;
  }
`;

const PasswordStrength = styled.div`
  margin-bottom: 16px;
  text-align: left;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
  
  &.weak {
    width: 25%;
    background: #ff4757;
  }
  
  &.fair {
    width: 50%;
    background: #ffa502;
  }
  
  &.good {
    width: 75%;
    background: #2ed573;
  }
  
  &.strong {
    width: 100%;
    background: #2ed573;
  }
`;

const StrengthText = styled.div`
  font-size: 12px;
  color: #666;
`;

const Requirements = styled.ul`
  text-align: left;
  font-size: 12px;
  color: #666;
  margin: 8px 0;
  padding-left: 16px;
`;

const Requirement = styled.li`
  margin: 4px 0;
  
  &.met {
    color: #2ed573;
  }
`;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tokenValid, setTokenValid] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Password strength validation
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) return 'weak';
    if (score < 3) return 'fair';
    if (score < 4) return 'good';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Verify token validity on load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/verify-reset-token/${token}`);
        setTokenValid(response.ok);
        
        if (!response.ok) {
          const errorData = await response.json();
          setMessage({ 
            type: 'error', 
            text: errorData.error || 'Invalid or expired token' 
          });
        }
      } catch (error) {
        setTokenValid(false);
        setMessage({ 
          type: 'error', 
          text: 'Error verifying token. Please try again.' 
        });
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setMessage({ type: 'error', text: 'Token not provided' });
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (passwordStrength === 'weak') {
      setMessage({ type: 'warning', text: 'Password is too weak. Consider using a stronger password.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error resetting password');
      }

      setPasswordChanged(true);
      setMessage({ 
        type: 'success', 
        text: 'Password reset successfully!' 
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error resetting password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If token is invalid
  if (tokenValid === false) {
    return (
      <Container>
        <Card>
          <Logo>
            <span style={{ color: "#fff", fontSize: 32 }}>❌</span>
          </Logo>
          <Title>Invalid Link</Title>
          <Description>
            This recovery link is invalid or has expired.
            Please request a new recovery link.
          </Description>
          
          {message.text && (
            <Message className={message.type}>
              {message.text}
            </Message>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <BackLink to="/forgot-password">Request New Link</BackLink>
            <BackLink to="/">← Back to Login</BackLink>
          </div>
        </Card>
      </Container>
    );
  }

  // If password was changed successfully
  if (passwordChanged) {
    return (
      <Container>
        <Card>
          <Logo>
            <span style={{ color: "#fff", fontSize: 32 }}>✅</span>
          </Logo>
          <Title>Password Reset!</Title>
          <Description>
            Your password has been reset successfully.
            You will be redirected to the login page in a few seconds.
          </Description>
          
          {message.text && (
            <Message className={message.type}>
              {message.text}
            </Message>
          )}

          <BackLink to="/">Go to Login Now</BackLink>
        </Card>
      </Container>
    );
  }

  // Reset form
  return (
    <Container>
      <Card>
        <Logo>
          <span style={{ color: "#fff", fontSize: 32 }}>🔐</span>
        </Logo>
        <Title>New Password</Title>
        <Description>
          Enter your new password. Make sure it's strong and secure.
        </Description>

        {message.text && (
          <Message className={message.type}>
            {message.text}
          </Message>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={8}
          />

          {formData.password && (
            <PasswordStrength>
              <StrengthBar>
                <StrengthFill className={passwordStrength} />
              </StrengthBar>
              <StrengthText>
                Password strength: {
                  passwordStrength === 'weak' ? 'Weak' :
                  passwordStrength === 'fair' ? 'Fair' :
                  passwordStrength === 'good' ? 'Good' : 'Strong'
                }
              </StrengthText>
              <Requirements>
                <Requirement className={formData.password.length >= 8 ? 'met' : ''}>
                  At least 8 characters
                </Requirement>
                <Requirement className={/[a-z]/.test(formData.password) ? 'met' : ''}>
                  Lowercase letter
                </Requirement>
                <Requirement className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                  Uppercase letter
                </Requirement>
                <Requirement className={/[0-9]/.test(formData.password) ? 'met' : ''}>
                  Number
                </Requirement>
                <Requirement className={/[^A-Za-z0-9]/.test(formData.password) ? 'met' : ''}>
                  Special character
                </Requirement>
              </Requirements>
            </PasswordStrength>
          )}

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          <Button type="submit" disabled={isLoading || tokenValid === null}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <BackLink to="/">← Back to Login</BackLink>
      </Card>
    </Container>
  );
} 