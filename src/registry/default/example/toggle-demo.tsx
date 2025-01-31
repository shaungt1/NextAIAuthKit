import { Toggle } from '@/registry/default/ui/toggle';

import { Bold } from 'lucide-react';

export default function ToggleDemo() {
    return (
        <Toggle aria-label='Toggle bold'>
            <Bold className='size-4' />
        </Toggle>
    );
}
