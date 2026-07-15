/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, RoleDefinition, Permission, LoginHistoryLog } from '../types';

const BASE_URL = ''; // Direct server routing relative to origin

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'clean24_access_token',
  REFRESH_TOKEN: 'clean24_refresh_token',
  USER_SESSION: 'clean24_user_session',
  REMEMBERED_USER: 'clean24_remembered_user'
};

// Simple fetch wrapper with token injection and automatic token refresh
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Attempt Token Refresh
    const freshToken = await attemptTokenRefresh();
    if (freshToken) {
      // Retry request with new token
      headers.set('Authorization', `Bearer ${freshToken}`);
      const retryResponse = await fetch(url, { ...options, headers });
      if (!retryResponse.ok) {
        const errData = await retryResponse.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${retryResponse.status}`);
      }
      return retryResponse.json() as Promise<T>;
    } else {
      // Clear session & force sign-out
      clearSession();
      window.dispatchEvent(new Event('unauthorized-session-expired'));
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function attemptTokenRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    return data.accessToken;
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
}

export function saveSession(accessToken: string, refreshToken: string, user: any) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
}

export function getSavedSessionUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export const authApi = {
  login: async (usernameOrEmail: string, password: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_USER, usernameOrEmail);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_USER);
    }

    const data = await apiRequest<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password, remember })
    });

    if (data && data.require2fa) {
      return data;
    }

    if (data && data.accessToken && data.refreshToken && data.user) {
      saveSession(data.accessToken, data.refreshToken, data.user);
      return data.user;
    }
    
    throw new Error('Malformed auth response from server');
  },

  verify2fa: async (mfaToken: string, code: string) => {
    const data = await apiRequest<any>('/api/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ mfaToken, code })
    });
    if (data && data.accessToken && data.refreshToken && data.user) {
      saveSession(data.accessToken, data.refreshToken, data.user);
      return data.user;
    }
    throw new Error('Invalid authentication context received from server');
  },

  logout: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (e) {}
    clearSession();
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ success: boolean; message: string; passcode?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (token: string, newPassword: any) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },

  getMe: async () => {
    return apiRequest<any>('/api/auth/me');
  },

  getRememberedUser: (): string => {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_USER) || '';
  }
};

export const userApi = {
  getUsers: async () => {
    const data = await apiRequest<{ success: boolean; users: User[] }>('/api/users');
    return data.users;
  },

  createUser: async (payload: Partial<User> & { password?: string }) => {
    const data = await apiRequest<{ success: boolean; user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return data.user;
  },

  getUser: async (id: string) => {
    const data = await apiRequest<{ success: boolean; user: User }>(`/api/users/${id}`);
    return data.user;
  },

  updateUser: async (id: string, payload: Partial<User>) => {
    const data = await apiRequest<{ success: boolean; user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return data.user;
  },

  deleteUser: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/users/${id}`, {
      method: 'DELETE'
    });
  },

  patchStatus: async (id: string, status: 'Active' | 'Inactive' | 'Locked') => {
    const data = await apiRequest<{ success: boolean; user: User }>(`/api/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return data.user;
  },

  resetPassword: async (id: string, newPassword: any) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword })
    });
  },

  assignBranches: async (id: string, assignedBranchIds: string[]) => {
    const data = await apiRequest<{ success: boolean; user: User }>(`/api/users/${id}/assign-branches`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedBranchIds })
    });
    return data.user;
  }
};

export const roleApi = {
  getRoles: async () => {
    const data = await apiRequest<{ success: boolean; roles: RoleDefinition[] }>('/api/roles');
    return data.roles;
  },

  createRole: async (name: string, description?: string) => {
    const data = await apiRequest<{ success: boolean; role: RoleDefinition }>('/api/roles', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
    return data.role;
  },

  updateRole: async (id: string, payload: { name?: string; description?: string }) => {
    const data = await apiRequest<{ success: boolean; role: RoleDefinition }>(`/api/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return data.role;
  },

  deleteRole: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/roles/${id}`, {
      method: 'DELETE'
    });
  },

  getPermissions: async () => {
    const data = await apiRequest<{ success: boolean; permissions: Permission[] }>('/api/permissions');
    return data.permissions;
  },

  updateRolePermissions: async (roleId: string, permissionIds: string[]) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissionIds })
    });
  }
};

export const logsApi = {
  getLoginHistory: async () => {
    const data = await apiRequest<{ success: boolean; logs: LoginHistoryLog[] }>('/api/login-history');
    return data.logs;
  }
};
