import { Toggle } from '@/registry/default/ui/toggle';

import { Underline } from 'lucide-react';

export default function ToggleDisabled() {
    return (
        <Toggle aria-label='Toggle underline' disabled>
            <Underline className='size-4' />
        </Toggle>
    );
}
