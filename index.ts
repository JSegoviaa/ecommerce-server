import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

import { Server } from './src/models';
moment.locale('es');

const server = new Server();

server.listen();
