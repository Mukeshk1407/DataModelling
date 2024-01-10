import { createAction, props } from '@ngrx/store';

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; username: string; role: string; email: string }>()
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());
export const logout = createAction('[Auth] Logout');
export const loadStoredAuthInfo = createAction('[Auth] Load Stored Auth Info');
