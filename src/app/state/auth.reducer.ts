// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';

export interface AuthState {
  token: string | null;
  loggedIn: boolean;
  username: string | null;
  role: string | null;
  email: string | null;
}

export const initialState: AuthState = {
  token: null,
  loggedIn: false,
  username: null,
  role: null,
  email: null,
};

export const authReducer = createReducer(
  initialState,
  on(authActions.loginSuccess, (state, { token, username, role, email }) => ({
    ...state,
    token,
    loggedIn: true,
    username,
    role,
    email,
  })),
  on(authActions.loginFailure, (state, { error }) => ({ ...state, token: null, loggedIn: false, error })),
  on(authActions.logout, (state) => initialState)
);
