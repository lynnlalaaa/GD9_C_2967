import bcrypt from 'bcrypt';
import { getSql } from '../lib/db';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

async function seedDatabase() {
  const sql = getSql();
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    })),
  );

  await sql.begin(async (tx) => {
    await tx`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await tx`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    await tx`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    await tx`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `;

    await tx`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    await tx`TRUNCATE TABLE invoices, customers, revenue, users RESTART IDENTITY CASCADE`;

    for (const user of hashedUsers) {
      await tx`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password});
      `;
    }

    for (const customer of customers) {
      await tx`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url});
      `;
    }

    for (const invoice of invoices) {
      await tx`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date});
      `;
    }

    for (const entry of revenue) {
      await tx`
        INSERT INTO revenue (month, revenue)
        VALUES (${entry.month}, ${entry.revenue});
      `;
    }
  });
}

export async function GET() {
  try {
    await seedDatabase();
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to seed database.',
      },
      { status: 500 },
    );
  }
}
