import { Button } from '@/registry/new-york/ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';

export default function ButtonIcon() {
    return (
        <Button variant='outline' size='icon'>
            <ChevronRightIcon className='size-4' />
        </Button>
    );
}
