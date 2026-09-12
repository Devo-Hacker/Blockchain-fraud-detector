import { AnkrProvider } from '@ankr.com/ankr.js';
import dotenv from 'dotenv';
dotenv.config();

const provider = new AnkrProvider(process.env.ANKR_ENDPOINT);

async function test() {
  const result = await provider.getTransactionsByAddress({
    blockchain: 'bsc',
    address: ['0x28C6c06298d514Db089934071355E5743bf21d60'],
    pageSize: 10,
    descOrder: true,
  });
  console.log(JSON.stringify(result, null, 2));
}

test();