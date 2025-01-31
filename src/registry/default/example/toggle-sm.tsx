import { Toggle } from '@/registry/default/ui/toggle';

import { Italic } from 'lucide-react';

export default function ToggleSm() {
    return (
        <Toggle size='sm' aria-label='Toggle italic'>
            <Italic className='size-4' />
        </Toggle>
    );
}
