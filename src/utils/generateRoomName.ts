export default (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join('-');
};
