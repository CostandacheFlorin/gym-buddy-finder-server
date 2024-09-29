import * as bcrypt from 'bcrypt';

export default async (password: string) => {
  const saltOrRounds = 10;
  return bcrypt.hash(password, saltOrRounds);
};
