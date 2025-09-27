import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
`;

const Link = styled(RouterLink)`
  color: #111;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the route where the user came from (if redirected from a protected route)
  const from = location.state?.from?.pathname || '/app/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result && result.success) {
        // Redirect to the page they came from or to dashboard
        navigate(from, { replace: true });
      } else {
        setError(result?.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connection error. Check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          {/* You can put an icon or logo here */}
          <span style={{ color: "#fff", fontSize: 32 }}>⬤</span>
        </Logo>
        <Title>Login</Title>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>Login</Button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/forgot-password">Forgot my password</Link>
        </div>
        
        <div>
          <span>Don't have any account? </span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </Card>
    </Container>
  );
}
