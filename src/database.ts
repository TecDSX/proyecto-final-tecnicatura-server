import { connect } from 'mongoose';
import { config } from './config';
export const createConnection = async (): Promise<void> => {
  const {
    db: { database, host, password, port, user },
  } = config;
  await connect(
    `mongodb://${
      user ? `${user}:${password}@` : ''
    }${host}:${port}/${database}`,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};
