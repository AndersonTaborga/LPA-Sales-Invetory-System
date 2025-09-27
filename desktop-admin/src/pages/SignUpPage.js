import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  width: 350px;
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
  margin-bottom: 24px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
  color: #111;
  font-size: 14px;
  text-decoration: underline;
`;

const Message = styled.div`
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;

  &.error {
    color: #ff4757;
    background: #ffe8e8;
  }

  &.success {
    color: #2ed573;
    background: #e8f5e8;
  }
`;

const Description = styled.p`
  margin-bottom: 24px;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #ff4757;
  background: #ffe8e8;
`;

const LoginLink = styled(Link)`
  display: block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validations
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating account');
      }

      // Registration successful
      alert('Account created successfully! You can now log in.');
      navigate('/');

    } catch (error) {
      setError(error.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <span style={{ color: "#fff", fontSize: 32 }}>👤</span>
        </Logo>
        <Title>Create Account</Title>
        <Description>
          Fill in your information to create a new account
        </Description>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSignUp}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={6}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <LoginLink to="/">
          Already have an account? <strong>Log in</strong>
        </LoginLink>
      </Card>
    </Container>
  );
}
