/**
 * Returns the appropriate dashboard route for a given user role.
 * @param {string} role - 'candidate' | 'recruiter'
 * @returns {string} - Dashboard route path
 */
export const getDashboardForRole = (role) => {
  return role === 'recruiter' ? '/scanner' : '/optimize';
};
