import { Connection, Client } from '@temporalio/client';

let temporalClient: Client;

async function main() {
    const connection = await Connection.connect();
    temporalClient = new Client({ connection });

}

main().catch((err) => {
    console.error('Error initializing Temporal client:', err);
    process.exit(1);
});

export { temporalClient };
