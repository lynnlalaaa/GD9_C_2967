'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});
import { z } from 'zod';

const FormSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    amount: z.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customer_id: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status') ,
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
}
    // const rawFormData = {
       // customerId: formData.get('customerId'),
       // amount: formData.get('amount'),
       // status: formData.get('status'),
   // };
   // console.log(rawFormData);
// }