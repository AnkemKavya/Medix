import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHeart, FiLock, FiMail, FiCheck, FiArrowRight, FiShield } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@medixhms.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@medixhms.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
        padding: '24px',
        position: 'relative'
      }}
    >
      {/* Background Decorative Healthcare Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 64, 175, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: '#1E40AF',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)'
            }}
          >
            <FiHeart size={28} color="#0D9488" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Medix HMS
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hospital Management System • v2.4.1
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div
          onClick={handleFillDemo}
          style={{
            marginBottom: '20px',
            padding: '10px 14px',
            backgroundColor: 'var(--primary-light)',
            border: '1px dashed var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          title="Click to auto-fill demo credentials"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiShield color="var(--primary)" size={16} />
            <div style={{ fontSize: '12px' }}>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Demo:</span>{' '}
              <code style={{ color: 'var(--text-primary)' }}>admin@medixhms.com</code> /{' '}
              <code style={{ color: 'var(--text-primary)' }}>password123</code>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
            Auto-fill
          </span>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: '18px',
              backgroundColor: 'var(--danger-light)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              <FiMail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@medixhms.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiLock size={14} /> Password
              </span>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Use the demo password: 'password123'");
                }}
                style={{ fontSize: '12px', color: 'var(--secondary)' }}
              >
                Forgot Password?
              </a>
            </label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              fontSize: '13px'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Remember my session</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            {!isLoading && <FiArrowRight size={17} />}
          </button>
        </form>

        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          Clinical Information System • Strict HIPAA & Medical Ethics Compliance
        </div>
      </div>
    </div>
  );
};
