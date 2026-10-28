import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
console.log('Testing URL:', url ? url.replace(/:[^:@]+@/, ':***@') : 'NONE');

const sql = neon(url);
sql`select 1 as ping`
    .then((r) => console.log('DB SUCCESS:', r))
    .catch((err) => {
        console.error('DB ERROR CAUSE:', err.cause);
        console.error('DB ERROR MESSAGE:', err.message);
        console.error('DB ERROR FULL:', err);
    });
