import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
`;

const Steps = styled.div`
  text-align: left;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const StepTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
`;

const StepList = styled.ol`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  padding-left: 1.2rem;
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error sending recovery email');
      }

      setEmailSent(true);
      setMessage({ 
        type: 'success', 
        text: 'Recovery email sent! Check your inbox.' 
      });

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error sending email. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Container>
        <Card>
          <Logo>
            <span style={{ color: "#fff", fontSize: 32 }}>📧</span>
          </Logo>
          <Title>Email Sent!</Title>
          <Description>
            We sent a recovery link to <strong>{email}</strong>.
            Check your inbox and spam folder.
          </Description>
          
          {message.text && (
            <Message className={message.type}>
              {message.text}
            </Message>
          )}

          <Steps>
            <StepTitle>Next steps:</StepTitle>
            <StepList>
              <li>Check your email (including spam/junk folder)</li>
              <li>Click on the recovery link</li>
              <li>Set a new password</li>
              <li>Login with your new password</li>
            </StepList>
          </Steps>

          <div style={{ marginTop: '1.5rem' }}>
            <BackLink to="/">← Back to Login</BackLink>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Logo>
          <span style={{ color: "#fff", fontSize: 32 }}>🔑</span>
        </Logo>
        <Title>Recover Password</Title>
        <Description>
          Enter your email to receive a password recovery link.
        </Description>

        {message.text && (
          <Message className={message.type}>
            {message.text}
          </Message>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Recovery Link'}
          </Button>
        </form>

        <BackLink to="/">← Back to Login</BackLink>
      </Card>
    </Container>
  );
} 