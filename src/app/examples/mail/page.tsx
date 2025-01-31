import Image from 'next/image';

import { Mail } from '@/app/examples/mail/components/mail';
import { accounts, mails } from '@/app/examples/mail/data';

export default function MailPage() {
    const defaultLayout = undefined;
    const defaultCollapsed = undefined;

    return (
        <>
            <div className='md:hidden'>
                <Image
                    src='https://ui.shadcn.com/examples/mail-dark.png'
                    width={1280}
                    height={727}
                    alt='Mail'
                    className='hidden dark:block'
                />
                <Image
                    src='https://ui.shadcn.com/examples/mail-light.png'
                    width={1280}
                    height={727}
                    alt='Mail'
                    className='block dark:hidden'
                />
            </div>
            <div className='hidden flex-col md:flex'>
                <Mail
                    accounts={accounts}
                    mails={mails}
                    defaultLayout={defaultLayout}
                    defaultCollapsed={defaultCollapsed}
                    navCollapsedSize={4}
                />
            </div>
        </>
    );
}
