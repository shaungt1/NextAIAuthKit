import { Toggle } from '@/registry/new-york/ui/toggle';
import { UnderlineIcon } from '@radix-ui/react-icons';

export default function ToggleDisabled() {
    return (
        <Toggle aria-label='Toggle italic' disabled>
            <UnderlineIcon className='size-4' />
        </Toggle>
    );
}
