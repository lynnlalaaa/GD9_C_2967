import { getSql } from '@/app/lib/db';

export async function GET() {
  try {
    const sql = getSql();
    const data = await sql<{ amount: number; name: string }[]>`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return Response.json(data);
  } catch (error) {
    console.error('Database Error:', error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to query database.',
      },
      { status: 500 },
    );
  }
}
