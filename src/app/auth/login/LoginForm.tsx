

'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';

export function LoginForm() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    // THIS HAS A SIDE EFFECT “immediate sign-in” side effect"
    // TODO: fix this to where it poplates the imputs or uses popup to to allow user to quick login
    // React.useEffect(() => {
    //     async function checkSession() {
    //         const result = await signIn('credentials', {
    //             email,
    //             password,
    //             redirect: false,
    //         });
            
    //         if (result?.ok) {
    //             const userSession = await fetch('/api/auth/session').then(res => res.json());
    //             console.log("✅ User Session:", userSession);
    //         }
    //     }
    //     checkSession();
    // }, [email, password]);
    

    // async function handleSubmit(event: React.SyntheticEvent) {
    //     event.preventDefault();
    //     setIsLoading(true);
    //     setErrorMessage('');

    //     try {
    //         console.log('Logging in with:', { email, password });

    //         const result = await signIn('credentials', {
    //             email,
    //             password,
    //             redirect: true, // Redirect to the profile page on success
    //             callbackUrl: '/profile',
    //         });

    //         if (!result?.ok) {
    //             throw new Error('Login failed. Check your credentials.');
    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         if (error instanceof Error) {
    //             setErrorMessage(error.message || 'An unexpected error occurred.');
    //         } else {
    //             setErrorMessage('An unexpected error occurred.');
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
    
        try {
            console.log('Logging in with:', { email, password });
    
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false, // Prevent auto-redirect, so we can handle it manually
            });
    
            if (result?.error) {
                throw new Error(result.error || 'Invalid email or password.');
            }
    
            if (result?.ok) {
                window.location.href = '/profile'; // Redirect to profile on success
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }
    
    async function handleGoogleSignIn() {
        try {
            setIsLoading(true);
            console.log('Initiating Google Sign-In...');
            await signIn('google', { redirect: true, callbackUrl: '/profile' });
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            setErrorMessage('Failed to sign in with Google.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Log In with Google'}
            </Button>
        </form>
    );
}



//  OLD WORKING CODE

// 'use client';

// import * as React from 'react';
// import { signIn } from 'next-auth/react';
// import { Button } from '@/registry/new-york/ui/button';
// import { Input } from '@/registry/new-york/ui/input';
// import { Label } from '@/registry/new-york/ui/label';

// export function LoginForm() {
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [email, setEmail] = React.useState('');
//     const [password, setPassword] = React.useState('');
//     const [errorMessage, setErrorMessage] = React.useState('');
    
//     React.useEffect(() => {
//         async function checkSession() {
//             const result = await signIn('credentials', {
//                 email,
//                 password,
//                 redirect: false,
//             });
            
//             if (result?.ok) {
//                 const userSession = await fetch('/api/auth/session').then(res => res.json());
//                 console.log("✅ User Session:", userSession);
//             }
//         }
//         checkSession();
//     }, [email, password]);
    

//     async function handleSubmit(event: React.SyntheticEvent) {
//         event.preventDefault();
//         setIsLoading(true);
//         setErrorMessage('');

//         try {
//             console.log('Logging in with:', { email, password });

//             const result = await signIn('credentials', {
//                 email,
//                 password,
//                 redirect: true, // Redirect to the profile page on success
//                 callbackUrl: '/profile',
//             });

//             if (!result?.ok) {
//                 throw new Error('Login failed. Check your credentials.');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             if (error instanceof Error) {
//                 setErrorMessage(error.message || 'An unexpected error occurred.');
//             } else {
//                 setErrorMessage('An unexpected error occurred.');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     async function handleGoogleSignIn() {
//         try {
//             setIsLoading(true);
//             console.log('Initiating Google Sign-In...');
//             await signIn('google', { redirect: true, callbackUrl: '/profile' });
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//             setErrorMessage('Failed to sign in with Google.');
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit} className="grid gap-6">
//             <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={isLoading}
//                 />
//             </div>
//             <div>
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={isLoading}
//                 />
//             </div>
//             {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
//             <Button type="submit" disabled={isLoading}>
//                 {isLoading ? 'Logging in...' : 'Log In'}
//             </Button>
//             <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
//                 {isLoading ? 'Signing in...' : 'Log In with Google'}
//             </Button>
//         </form>
//     );
// }
