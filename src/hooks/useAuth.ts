// This is a mock auth hook. In a real application, you would implement
// this to return the actual authenticated user and their roles from your auth provider.
export const useAuth = () => {
  return {
    // You can change the roles array to test different access levels.
    // Allowed roles: 'admin', 'analyst', 'wireless-hunter'.
    // e.g., to test as an unauthorized user, set roles to ['viewer'].
    user: {
      id: 'user-123',
      name: 'Wireless Hunter',
      email: 'hunter@adversai.com',
      roles: ['wireless-hunter', 'analyst'],
    },
    // To test a logged-out state, you can return user as null:
    // user: null,
  };
};
