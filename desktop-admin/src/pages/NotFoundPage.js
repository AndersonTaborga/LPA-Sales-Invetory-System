import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 2rem;
`;

const Content = styled.div`
  text-align: center;
  max-width: 500px;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;

  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
`;

const Illustration = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Container>
      <Content>
        <Illustration>🔍</Illustration>
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Description>
          Sorry, the page you are looking for does not exist or has been moved.
        </Description>
        
        <ButtonGroup>
          {isAuthenticated ? (
            <>
              <Button to="/app/dashboard" className="primary">
                Go to Dashboard
              </Button>
              <Button to="/app/products" className="secondary">
                View Products
              </Button>
            </>
          ) : (
            <>
              <Button to="/" className="primary">
                Login
              </Button>
              <Button to="/signup" className="secondary">
                Create Account
              </Button>
            </>
          )}
          <BackLink to="/">← Back to Login</BackLink>
        </ButtonGroup>
      </Content>
    </Container>
  );
} 