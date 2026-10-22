'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_BASE_URL, setAuthHeaderProvider, fetchWithTimeout } from './api';

export interface AuthUser {
  id?: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  googleId?: string;
  role?: string;
}



export type BackendAuthStatus =
  | 'checking'
  | 'authenticated'
  | 'unauthenticated'
  | 'endpoint_missing'
  | 'error';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendAuthStatus: BackendAuthStatus;
  backendAuthError: string | null;
  initiateGoogleLogin: (nextUrl?: string) => void;
  checkSession: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_STORAGE_KEY = 'leeto_auth_token';



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAuthStatus, setBackendAuthStatus] = useState<BackendAuthStatus>('checking');
  const [backendAuthError, setBackendAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Public pages do not need a session probe when the visitor has no bearer
  // token yet. This keeps the landing page free of a cross-origin /auth/me
  // request (and its console noise if the API is unavailable). Protected
  // routes still verify the HTTP-only cookie session.
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

  

  // Verify active session with backend GET /api/auth/me
  const checkSession = useCallback(async (): Promise<AuthUser | null> => {
    try {
      // Connect existing session token if present
      const token = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;
      if (token) {
        setAuthHeaderProvider(() => ({
          Authorization: `Bearer ${token}`
        }));
      }

      const res = await fetchWithTimeout('/api/auth/me', { method: 'GET' }, 5000);

      if (res.ok) {
        const data = await res.json();
        const profile: AuthUser = {
          id: data.user?.id || data.id,
          username: data.user?.username || data.username || data.name || 'Developer',
          email: data.user?.email || data.email,
          avatarUrl: data.user?.avatarUrl || data.avatarUrl || data.picture,
          googleId: data.user?.googleId || data.googleId || data.sub,
          role: data.user?.role || data.role
        };
        setUser(profile);
        setBackendAuthStatus('authenticated');
        setBackendAuthError(null);
        return profile;
      }

      if (res.status === 401) {
        // Normal unauthenticated state
        setUser(null);
        setBackendAuthStatus('unauthenticated');
        setBackendAuthError(null);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthHeaderProvider(() => ({}));
        return null;
      }

      if (res.status === 404) {
        // Backend /api/auth/me endpoint is not implemented
        setUser(null);
        setBackendAuthStatus('endpoint_missing');
        setBackendAuthError('The backend authentication endpoint (/api/auth/me) was not found.');
        return null;
      }

      setUser(null);
      setBackendAuthStatus('error');
      setBackendAuthError(`Backend returned HTTP ${res.status}`);
      return null;
    } catch (err: any) {
      setUser(null);
      setBackendAuthStatus('error');
      setBackendAuthError(err.message || 'Failed to verify backend authentication');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);



  // Inspect URL for token or error passed back from backend OAuth redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(window.location.href);
      const tokenParam = url.searchParams.get('token') || url.searchParams.get('access_token');
      const errorParam = url.searchParams.get('error') || url.searchParams.get('auth_error');

      if (tokenParam) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenParam);
        setAuthHeaderProvider(() => ({
          Authorization: `Bearer ${tokenParam}`
        }));
        // Clean URL to prevent leaking token in browser history
        url.searchParams.delete('token');
        url.searchParams.delete('access_token');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }

      if (errorParam) {
        setBackendAuthError(decodeURIComponent(errorParam));
        url.searchParams.delete('error');
        url.searchParams.delete('auth_error');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    } catch {
      // Ignore URL parse error
    }

    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (isPublicRoute && !token) {
      setUser(null);
      setIsLoading(false);
      setBackendAuthStatus('unauthenticated');
      setBackendAuthError(null);
      return;
    }

    checkSession();
  }, [checkSession, isPublicRoute]);

  /**
   * Redirects browser to backend Google OAuth initiation endpoint.
   * The backend handles the complete Google OAuth redirect, state, token exchange, and session creation.
   */
  const initiateGoogleLogin = useCallback((nextUrl?: string) => {
    if (typeof window === 'undefined') return;

    const targetRoute = nextUrl || '/overview';
    const callbackOrigin = window.location.origin;
    const redirectUrl = `${callbackOrigin}${targetRoute}`;

    // Navigate directly to backend OAuth initiation endpoint
    const backendOAuthUrl = `${API_BASE_URL}/api/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
    window.location.href = backendOAuthUrl;
  }, []);

  /**
   * Terminate session via backend POST /api/auth/logout and clear client credentials
   */
  const logout = useCallback(async () => {
    try {
      await fetchWithTimeout('/api/auth/logout', { method: 'POST' }, 3000).catch(() => {
        // Backend logout best-effort
      });
    } finally {
      setUser(null);
      setBackendAuthStatus('unauthenticated');
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem('leettracker_auth_session_v1');
      sessionStorage.removeItem('leettracker_auth_token');
      setAuthHeaderProvider(() => ({}));
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        backendAuthStatus,
        backendAuthError,
        initiateGoogleLogin,
        checkSession,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export async function getExtensionToken(): Promise<{
  extension_token: string;
  expires_in_minutes: number;
}> {
  const response = await fetchWithTimeout(
    '/api/auth/extension-token',
    { method: 'POST' },
    5000
  );

  if (!response.ok) {
    throw new Error(
      `Could not get extension token (HTTP ${response.status}). Please sign in again.`
    );
  }

  const data = await response.json();

  if (!data.success || !data.extension_token) {
    throw new Error('Invalid extension token response.');
  }

  return data;
}

export async function connectChromeExtension(): Promise<{
  success: boolean;
  expires_in_minutes: number;
  token: string;
  autoSynced: boolean;
}> {
  const data = await getExtensionToken();
  const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;

  const chromeApi = (
    window as Window & {
      chrome?: {
        runtime?: {
          sendMessage?: (
            extensionId: string,
            message: object,
            callback: (response: any) => void
          ) => void;
          lastError?: { message?: string };
        };
      };
    }
  ).chrome;

  // Attempt auto-sync if Chrome extension messaging API is available
  if (extensionId && chromeApi?.runtime?.sendMessage) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        chromeApi.runtime!.sendMessage!(
          extensionId,
          { type: 'SET_TOKEN', token: data.extension_token },
          (reply) => {
            const error = chromeApi.runtime?.lastError;
            if (error) {
              reject(new Error(error.message || 'Extension messaging failed.'));
              return;
            }
            resolve(reply);
          }
        );
      });

      if (result?.success) {
        return {
          success: true,
          expires_in_minutes: data.expires_in_minutes,
          token: data.extension_token,
          autoSynced: true
        };
      }
    } catch {
      // Auto-sync failed or origin was rejected; proceed to fallback
    }
  }

  // Graceful fallback: return token so user can paste it into the extension popup
  return {
    success: true,
    expires_in_minutes: data.expires_in_minutes,
    token: data.extension_token,
    autoSynced: false
  };
}


/**
 * Route guard component for protected application routes.
 * If user is unauthenticated, redirects them to /login with target next param.
 * Prevents flashing protected content before backend verification completes.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, backendAuthStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading || backendAuthStatus === 'checking') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-2.5 text-xs font-mono text-neutral-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
          <span>Verifying backend session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
