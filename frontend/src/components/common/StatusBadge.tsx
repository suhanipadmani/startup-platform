import type { ProjectStatus } from '../types';
import clsx from 'clsx';

export default function StatusBadge({ status }: { status: ProjectStatus }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                styles[status]
            )}
        >
            {status}
        </span>
    );
}