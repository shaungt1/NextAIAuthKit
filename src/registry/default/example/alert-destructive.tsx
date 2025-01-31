import { Alert, AlertDescription, AlertTitle } from '@/registry/default/ui/alert';

import { AlertCircle } from 'lucide-react';

export default function AlertDestructive() {
    return (
        <Alert variant='destructive'>
            <AlertCircle className='size-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
    );
}
