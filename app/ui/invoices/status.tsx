import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
        {
          'bg-gray-100 text-gray-700':
            status.toLowerCase() === 'pending',
          'bg-green-500 text-white':
            status.toLowerCase() === 'paid',
        },
      )}
    >
      {status.toLowerCase() === 'pending' ? (
        <>
          Pending
          <ClockIcon className="w-4" />
        </>
      ) : (
        <>
          Paid
          <CheckIcon className="w-4" />
        </>
      )}
    </span>
  );
}