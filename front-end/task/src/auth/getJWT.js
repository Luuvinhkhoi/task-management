import { fetchAuthSession } from 'aws-amplify/auth';

export const getJWT = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString(); // hoặc accessToken
  } catch (error) {
    console.error('Cannot fetch JWT:', error);
    return null;
  }
};
