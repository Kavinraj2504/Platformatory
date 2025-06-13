import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_SECRET!

export const generateTokens = (user: any) => {
  const payload = { id: user.googleId, email: user.email };
  const accessToken = jwt.sign(payload,JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload,JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
