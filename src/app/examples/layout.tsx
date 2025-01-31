import { Metadata } from 'next';
import Link from 'next/link';

import { ExamplesNav } from '@/components/examples-nav';
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Button, buttonVariants } from '@/registry/new-york/ui/button';

export const metadata: Metadata = {
    title: 'Examples',
    description: 'Check out some examples app built using the components.'
};

interface ExamplesLayoutProps {
    children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
    return (
        <div className='container relative mx-auto mb-12 mt-20 sm:mt-12'>
            <PageHeader>
                <PageHeaderHeading className='hidden md:block'>Check out some examples</PageHeaderHeading>
                <PageHeaderHeading className='md:hidden'>Examples</PageHeaderHeading>
                <PageHeaderDescription>
                    These examples are taken from shadcn official repo on Github (
                    <Link className='text-blue-500' href='https://github.com/shadcn-ui/ui'>
                        https://github.com/shadcn-ui/ui
                    </Link>
                    )
                </PageHeaderDescription>
                <PageActions>
                    <Button asChild size='sm'>
                        <Link href='https://ui.shadcn.com' target='_blank'>
                            Shadcn UI
                        </Link>
                    </Button>
                    <Button asChild size='sm' variant='ghost'>
                        <Link href='https://github.com/SiddharthaMaity/nextjs-15-starter-core' target='_blank'>
                            Github
                        </Link>
                    </Button>
                </PageActions>
            </PageHeader>
            <section>
                <ExamplesNav />
                <div className='overflow-hidden rounded-[0.5rem] border bg-background shadow'>{children}</div>
            </section>
        </div>
    );
}
