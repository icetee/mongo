'use babel';

export const mongoConfigSchema = {
  host: 'localhost',
  port: '27017',
  db: 'test',
  auth: {
    enable: false,
    source: 'admin',
    username: '',
    password: '',
  },
  options: {},
};
