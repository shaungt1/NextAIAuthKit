import { Button } from '@/registry/new-york/ui/button';
import { EnvelopeOpenIcon } from '@radix-ui/react-icons';

export default function ButtonWithIcon() {
    return (
        <Button>
            <EnvelopeOpenIcon /> Login with Email
        </Button>
    );
}
