// 'use client';

// import React, { useEffect, useState } from 'react';

// import { Button } from '@/registry/new-york/ui/button';
// import { Card } from '@/registry/new-york/ui/card';

// import { Camera, Edit, Facebook, Instagram, Link, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
// import { signOut, useSession } from 'next-auth/react';

// export default function EditProfilePage() {
//     const { data: session, status } = useSession({
//         required: true,
//         onUnauthenticated() {
//             window.location.href = '/auth/login';
//         }
//     });

//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         role: '',
//         userId: '',
//         joinedDate: '',
//         daysActive: '',
//         location: '',
//         phone: '',
//         title: '',
//         bio: '',
//         facebook: '',
//         instagram: '',
//         twitter: '',
//         youtube: '',
//         linkedin: '',
//         website: '',
//         password: { current: '', new: '' }
//     });

//     const [geoLocation, setGeoLocation] = useState({ city: '', country: '' });
//     const [message, setMessage] = useState('');
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);

//     // Fetch user data and geolocation
//     useEffect(() => {
//         async function fetchUserData() {
//             try {
//                 const response = await fetch('/api/user/get');
//                 const user = await response.json();

//                 // Calculate days active
//                 const joinedDate = new Date(user.createdAt);
//                 const daysActive = Math.floor((new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));

//                 setFormData({
//                     ...formData,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     userId: user.id,
//                     joinedDate: joinedDate.toLocaleDateString(),
//                     daysActive,
//                     phone: user.phone || '',
//                     title: user.title || '',
//                     bio: user.bio || '',
//                     facebook: user.facebook || '',
//                     instagram: user.instagram || '',
//                     twitter: user.twitter || '',
//                     youtube: user.youtube || '',
//                     linkedin: user.linkedin || '',
//                     website: user.website || ''
//                 });
//             } catch (error) {
//                 console.error('[Fetch User Data Error]:', error);
//             }
//         }

//         async function fetchGeoLocation() {
//             navigator.geolocation.getCurrentPosition(async (position) => {
//                 try {
//                     const { latitude, longitude } = position.coords;
//                     const response = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
//                     const data = await response.json();
//                     setGeoLocation({ city: data.city, country: data.country });
//                     setFormData({ ...formData, location: `${data.city}, ${data.country}` });
//                 } catch (error) {
//                     console.error('[GeoLocation Error]:', error);
//                 }
//             });
//         }

//         fetchUserData();
//         fetchGeoLocation();
//     }, []);

//     async function handleUpdateProfile(event: React.FormEvent) {
//         event.preventDefault();
//         setIsUpdating(true);
//         setMessage('');

//         try {
//             const response = await fetch('/api/user/update', {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData)
//             });
//             if (!response.ok) throw new Error('Failed to update profile.');

//             setMessage('Profile updated successfully.');
//         } catch (error: any) {
//             console.error('[Update Error]:', error.message);
//             setMessage(error.message || 'An unexpected error occurred.');
//         } finally {
//             setIsUpdating(false);
//         }
//     }

//     async function handleDeleteAccount() {
//         if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//             return;
//         }

//         setIsDeleting(true);
//         setMessage('');

//         try {
//             const response = await fetch('/api/user/delete', { method: 'DELETE' });
//             if (!response.ok) throw new Error('Failed to delete account.');

//             setMessage('Account deleted successfully. Redirecting...');
//             signOut({ callbackUrl: '/' });
//         } catch (error: any) {
//             console.error('[Delete Error]:', error.message);
//             setMessage(error.message || 'An unexpected error occurred.');
//         } finally {
//             setIsDeleting(false);
//         }
//     }

//     if (status === 'loading') return <p>Loading...</p>;
//     return (
//         <div className='flex min-h-screen flex-col items-center bg-background p-6 pt-24 text-foreground dark:bg-zinc-950 dark:text-zinc-100'>
//             {/* Page Title */}
//             <h1 className='mb-10 text-3xl font-bold'>Edit Profile</h1>

//             <form
//                 onSubmit={handleUpdateProfile}
//                 className='w-full max-w-3xl space-y-8 rounded-lg bg-card p-6 shadow-lg dark:bg-zinc-900'>
//                 {/* Top Section: Profile Header */}
//                 <div className='mb-8 flex items-center gap-6'>
//                     {/* Profile Picture */}
//                     <div className='relative'>
//                         <img
//                             src={formData.image || 'https://via.placeholder.com/150'}
//                             alt='Profile'
//                             className='h-32 w-32 rounded-full border-4 border-card shadow-md dark:border-zinc-700'
//                         />
//                         <Button
//                             type='button'
//                             className='absolute bottom-0 right-0 rounded-full bg-primary p-2 shadow-lg transition hover:bg-primary-hover'
//                             onClick={() => alert('Feature to upload profile picture coming soon!')}>
//                             <Camera className='h-5 w-5 text-white' />
//                         </Button>
//                     </div>

//                     {/* General Info */}
//                     <div className='flex flex-col space-y-2'>
//                         <div className='flex items-center gap-2'>
//                             <h2 className='text-xl font-semibold'>{formData.name}</h2>
//                             <Edit className='h-4 w-4 cursor-pointer text-muted-foreground' />
//                         </div>
//                         <div className='flex items-center gap-2'>
//                             <p className='text-sm text-muted-foreground'>
//                                 {formData.title || 'Add a professional title'}
//                             </p>
//                             <Edit className='h-4 w-4 cursor-pointer text-muted-foreground' />
//                         </div>
//                         <p className='text-sm text-muted-foreground'>
//                             Member since {formData.joinedDate} • {formData.daysActive} days active
//                         </p>
//                     </div>
//                 </div>

//                 {/* General Information */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold'>General Information</h3>
//                     <div className='space-y-3'>
//                         <div>
//                             <label htmlFor='email' className='block text-sm text-muted-foreground'>
//                                 Email (Non-Editable)
//                             </label>
//                             <input
//                                 id='email'
//                                 type='email'
//                                 value={formData.email}
//                                 readOnly
//                                 className='input-class bg-muted-foreground/10'
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor='role' className='block text-sm text-muted-foreground'>
//                                 Role
//                             </label>
//                             <input
//                                 id='role'
//                                 type='text'
//                                 value={formData.role}
//                                 readOnly
//                                 // className='input-class bg-muted-foreground/10'
//                                 className="w-full p-2 border rounded-lg dark:bg-zinc-800"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor='userId' className='block text-sm text-muted-foreground'>
//                                 User ID
//                             </label>
//                             <input
//                                 id='userId'
//                                 type='text'
//                                 value={formData.userId}
//                                 readOnly
//                                 className='input-class bg-muted-foreground/10'
//                             />
//                         </div>
//                     </div>
//                 </Card>

//                 {/* Location */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold'>Location</h3>
//                     <div>
//                         <label htmlFor='location' className='block text-sm text-muted-foreground'>
//                             Location (City, Country)
//                         </label>
//                         <input
//                             id='location'
//                             type='text'
//                             value={formData.location}
//                             readOnly
//                             className='input-class bg-muted-foreground/10'
//                         />
//                     </div>
//                 </Card>

//                 {/* Contact Information */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold'>Contact Information</h3>
//                     <div>
//                         <label htmlFor='phone' className='block text-sm text-muted-foreground'>
//                             Phone Number
//                         </label>
//                         <input
//                             id='phone'
//                             type='tel'
//                             value={formData.phone}
//                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                             className='input-class'
//                         />
//                     </div>
//                 </Card>

//                 {/* Professional Details */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold'>Professional Details</h3>
//                     <div>
//                         <label htmlFor='title' className='block text-sm text-muted-foreground'>
//                             Professional Title
//                         </label>
//                         <input
//                             id='title'
//                             type='text'
//                             value={formData.title}
//                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                             className='input-class'
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor='bio' className='block text-sm text-muted-foreground'>
//                             Bio/Description
//                         </label>
//                         <textarea
//                             id='bio'
//                             value={formData.bio}
//                             onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//                             className='input-class'
//                         />
//                     </div>
//                 </Card>

//                 {/* Social Links */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold'>Social Links</h3>
//                     {[
//                         { id: 'facebook', label: 'Facebook', icon: Facebook },
//                         { id: 'instagram', label: 'Instagram', icon: Instagram },
//                         { id: 'twitter', label: 'Twitter', icon: Twitter },
//                         { id: 'youtube', label: 'YouTube', icon: Youtube },
//                         { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
//                         { id: 'website', label: 'Website', icon: Link }
//                     ].map(({ id, label, icon: Icon }) => (
//                         <div key={id} className='flex items-center gap-2'>
//                             <Icon className='h-4 w-4 text-muted-foreground' />
//                             <input
//                                 id={id}
//                                 type='url'
//                                 placeholder={label}
//                                 value={formData[id]}
//                                 onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
//                                 className='input-class'
//                             />
//                         </div>
//                     ))}
//                 </Card>

//                 {/* Security Section */}
//                 <Card className='space-y-4 p-4'>
//                     <h3 className='text-lg font-semibold text-red-600'>Security</h3>
//                     <div>
//                         <label htmlFor='currentPassword' className='block text-sm text-muted-foreground'>
//                             Current Password
//                         </label>
//                         <input
//                             id='currentPassword'
//                             type='password'
//                             placeholder='Enter current password'
//                             className='input-class'
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor='newPassword' className='block text-sm text-muted-foreground'>
//                             New Password
//                         </label>
//                         <input
//                             id='newPassword'
//                             type='password'
//                             placeholder='Enter new password'
//                             className='input-class'
//                         />
//                     </div>
//                     <Button type='button' className='w-full bg-primary'>
//                         Update Password
//                     </Button>
//                 </Card>

//                 {/* Danger Zone */}
//                 <Card className='space-y-4 bg-red-50 p-4 dark:bg-red-900'>
//                     <h3 className='text-lg font-semibold text-red-600'>Danger Zone</h3>
//                     <p className='text-sm text-muted-foreground'>
//                         Deleting your account is irreversible. All data will be permanently removed.
//                     </p>
//                     <Button type='button' className='w-full bg-red-600' onClick={handleDeleteAccount}>
//                         Delete Account
//                     </Button>
//                 </Card>

//                 {/* Save Changes */}
//                 <div className='flex justify-center'>
//                     <Button type='submit' className='w-full max-w-sm bg-primary'>
//                         Save Changes
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }
