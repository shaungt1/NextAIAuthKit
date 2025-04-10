# Trace Auth Routes April 3rd 2025

This document provides a detailed overview of how the authentication-related files connect within the project. It also groups them by functionality, notes any unused files or code, and offers recommendations for streamlining.

---

## 1. Navigation & Layout

**Files**  
- `NavigationBar.tsx`  
- `NavigationLinks.tsx`  
- `routes.ts`

**Connections & Details**  
- `NavigationBar.tsx` displays the navigation bar. It likely references [`NavigationLinks.tsx`](../navbar/NavigationLinks.tsx) (based on the naming).  
- `NavigationLinks.tsx` shows the navigation links for both public and protected routes. It has imports for `NAVIGATION_LINKS` and `NAVIGATION_LINKS_SECURE` commented out, meaning it is not actively reading from [`routes.ts`](../routes.ts).  
- `routes.ts` defines arrays for navigation links but is not actually utilized since the import is commented out in `NavigationLinks.tsx`.

**Recommendations**  
- Consider fully importing and using `routes.ts` in `NavigationLinks.tsx` (or removing it if no longer needed).  
- Ensure `NavigationBar.tsx` references `NavigationLinks.tsx` correctly for consistent routing.

---

## 2. Authentication & Page Files

### 2.1 NextAuth Configuration
- **[`api/auth/[...nextauth]/route.ts`](../api/auth/[...nextauth]/route.ts)**  
  - Implements NextAuth using [`authOptions.ts`](../api/authoptions/authOptions.ts).  
- **[`authOptions.ts`](../api/authoptions/authOptions.ts)**  
  - Main NextAuth setup, referencing Prisma and setting pages to `/auth/login` and `/auth/error`.

### 2.2 Login Flow
- **[`auth/login/page.tsx`](../auth/login/page.tsx)**  
  - Renders a login page. Currently references `LoginForm.tsx`.  
- **[`LoginForm.tsx`](../auth/login/LoginForm.tsx)**  
  - Contains placeholders or references for next-auth’s `signIn()`.  

### 2.3 Sign-Up Flow
- **[`auth/signup/page.tsx`](../auth/signup/page.tsx)**  
  - A sign-up page that currently does not render [`UserAuthSignUpForm`](../auth/signup/user-auth-signup-form.tsx) (the import is commented out).  
- **[`user-auth-signup-form.tsx`](../auth/signup/user-auth-signup-form.tsx)**  
  - Contains sign-up logic (Google SSO or credentials) but remains unused with the current code, as it is not imported.

### 2.4 Settings & Profile
- **[`auth/settings/page.tsx`](../auth/settings/page.tsx)**  
  - Protected route for users to update or delete their account. Uses the session from NextAuth. Calls `fetch('/api/user/delete')`.  
- **[`SecuritySection.tsx`](../auth/security/SecuritySection.tsx)**  
  - Handles password updates, but no file references it.

**Recommendations**  
- If sign-up functionality is intended, restore the import of `UserAuthSignUpForm`.  
- If `SecuritySection` is part of planned functionality, integrate it where relevant (e.g., a settings page component).  

---

## 3. API Files

### 3.1 Distributed Endpoints under `/api`
- **[`api/auth/signup/route.ts`](../api/auth/signup/route.ts)**  
  - Creates or updates a user for Google or credentials sign-up.  
- **[`api/protected/route.ts`](../api/protected/route.ts)**  
  - Example admin-only route.  
- **[`api/admin/route.ts`](../api/admin/route.ts)**  
  - Demonstrates admin-specific operations (GET, POST, DELETE).  

### 3.2 User-Specific Endpoints
- **[`api/user/delete`](../api/user/delete) Folder**  
  - `delete.ts`, `route.ts` both define a `DELETE` request to remove a user.  
  - Neither uses `delete_user.ts`.  
- **[`delete_user.ts`](../api/user/delete/delete_user.ts)**  
  - Contains a function `deleteUser(userId: string)` that is **not actually called** in the code.  
- **[`api/user/profile-data/route.ts`](../api/user/profile-data/route.ts)**  
  - Returns user profile data based on session.  
- **[`api/user/update-password/route.ts`](../api/user/update-password/route.ts)**  
  - Allows password changes for an authenticated user.  
- **[`api/user/update-profile/route.ts`](../api/user/update-profile/route.ts)**  
  - Updates user data (including `profileImage` as a `Bytes` type).  
- **[`api/user/update/route.ts`](../api/user/update/route.ts)**  
  - Similar or partial user update logic (conceptually overlaps with `update-profile`).  
- **[`api/user/profile-image/profile-image.ts`](../api/user/profile-image/profile-image.ts)**  
  - GET/PATCH endpoints for user profile images.

**Recommendations**  
- Combine or consolidate endpoints under a single standard for update operations, e.g., `update-profile` vs `update`.  
- Consider removing or integrating `delete_user.ts` if needed.  

---

## 4. Middleware
- **[`middleware.ts`](../app/middleware.ts)**  
  - Entire file is commented out (not used).

**Recommendation**  
- Either remove or implement it for route protection.

---

## 5. Summary of Unused or Underused Files
1. `routes.ts` – Not imported (its usage is commented out).  
2. `delete_user.ts` – Not called by any delete route.  
3. `middleware.ts` – All commented out.  
4. `user-auth-signup-form.tsx` – Not rendered on the sign-up page.  
5. `SecuritySection.tsx` – Not imported by any page.

---

## 6. Final Recommendations
1. **Clean Up Unused Logic**  
   - Delete or integrate any references to `delete_user.ts`, `routes.ts`, or `middleware.ts`.
2. **Streamline Sign-Up**  
   - If you want a working sign-up flow, import `UserAuthSignUpForm` in your sign-up page and confirm it calls `authOptions.ts`.
3. **Consolidate User Update Files**  
   - Consider merging `update-profile` and `update` routes for a single update endpoint.
4. **Use a Single Delete Flow**  
   - Select between `delete.ts` and `route.ts` in `/user/delete`.
5. **Incorporate SecuritySection**  
   - If password updates are needed, link `SecuritySection.tsx` into `settings/page.tsx` or a relevant place.
