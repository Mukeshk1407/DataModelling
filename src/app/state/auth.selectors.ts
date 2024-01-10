import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(selectAuthState, (state) => state.token);
export const selectLoggedIn = createSelector(selectAuthState, (state) => state.loggedIn);
export const selectUsername = createSelector(selectAuthState, (state) => state.username);
export const selectRole = createSelector(selectAuthState, (state) => state.role);
export const selectEmail = createSelector(selectAuthState, (state) => state.email);
