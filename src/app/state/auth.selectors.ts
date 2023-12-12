import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Get the feature state (authentication state)
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors for specific pieces of state
export const selectToken = createSelector(selectAuthState, (state) => state.token);
export const selectUsername = createSelector(selectAuthState, (state) => state.username);
export const selectRole = createSelector(selectAuthState, (state) => state.role);
export const selectLoggedIn = createSelector(selectAuthState, (state) => state.loggedIn);
