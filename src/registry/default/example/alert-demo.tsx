import { Alert, AlertDescription, AlertTitle } from '@/registry/default/ui/alert';

import { Terminal } from 'lucide-react';

export default function AlertDemo() {
    return (
        <Alert>
            <Terminal className='size-4' />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
        </Alert>
    );
}
