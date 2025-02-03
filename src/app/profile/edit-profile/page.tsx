'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/registry/new-york/ui/button';
import { Card } from '@/registry/new-york/ui/card';
import { useToast } from "@/registry/new-york/hooks/use-toast";
import { Camera, Edit, Facebook, Instagram, Link, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import ImageEditorModal from '@/components/ImageEditorModal';
import { off } from 'process';
import SecuritySection from '@/components/SecuritySection';

export default function EditProfilePage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/auth/login';
        }
    });

  
    
    
    interface FormData {
      name: string;
      email: string;
      role: string;
      userId: string;
      joinedDate: string;
      daysActive: string;
      location: string;
      latitude: string;
      longitude: string;
      ipAddress: string;
      geodata: string;
      phone: string;
      title: string;
      bio: string;
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
      linkedin: string;
      website: string;
      profileImage: string;
      imageOffsetX: number;
      imageOffsetY: number;
      imageZoom: number;
  }
  

    interface UpdateResponse {
      user: FormData;
  }


  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    name: false,
    title: false,
  });

  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isUploading, setIsUploading] = useState(false);
  const [geoLocation, setGeoLocation] = useState({ city: '', country: '' });
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  
   /**
    * Fetches users data on component mount.
    * @returns - User data from the server.
    */
    useEffect(() => {
      async function fetchUserData() {
        try {
          const response = await fetch('/api/user/profile-data');
          if (!response.ok) throw new Error('Failed to fetch user data.');
          console.log('[Fetch User Data]UseEffect Response:', response);
          const user = await response.json();
          console.log('[Fetch User Data] Basic User Data Object:', user); // Debug log
    
          setFormData((prevState) => ({
            ...prevState,
            profileImage: user.profileImage
              ? `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}` // Decode BLOB
              : '',
            imageOffsetX: user.imageOffsetX || 0,
            imageOffsetY: user.imageOffsetY || 0,
            imageZoom: user.imageZoom || 1,
          }));
          setProfileImage(
            user.profileImage
              ? `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}`
              : ''
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error('[Fetch User Data Error]:', error.message);
          } else {
            console.error('[Fetch User Data Error]:', error);
          }
        }
      }
    
      fetchUserData();
    }, []);
    
   
    

      const handleEditClick = (field: string) => {
        setIsEditing((prevState) => ({
          ...prevState,
          [field]: !prevState[field],
        }));
      };
      
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      };
      
      // const handleInputBlur = (field: string) => {
      //   setIsEditing((prevState) => ({
      //     ...prevState,
      //     [field]: false,
      //   }));
      // };

      const handleInputBlur = async (field: string) => {
        setIsEditing((prevState) => ({
          ...prevState,
          [field]: false,
        }));
      
        try {
          // Make an API call to save the updated field
          const updatedFieldData = { [field]: formData[field as keyof typeof formData] };
      
          const response = await fetch('/api/user/update-profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFieldData),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('[Update Error]', errorData.message);
            throw new Error(errorData.message || 'Failed to save field data.');
          }
      
          console.log('[Auto-save Success]', field, updatedFieldData);
        } catch (error) {
          console.error('[Auto-save Error]:', error);
        }
      };
      
      
      
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
        if (e.key === 'Enter') {
          setIsEditing((prevState) => ({
            ...prevState,
            [field]: false,
          }));
        }
      };
      
  const [userData, setUserData] = useState({
    name: session?.user?.name || "N/A",
    email: session?.user?.email || "No email provided",
    image: session?.user?.image || "",
    role: session?.user?.role || "N/A",
    userId: session?.user?.id || "N/A",
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    userId: '',
    joinedDate: '',
    daysActive: '',
    location: '',
    latitude: 0,
    longitude: 0,
    ipAddress: '',
    geodata: '',
    phone: '',
    title: '',
    bio: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    website: '',
    profileImage: '',
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageZoom: 1,
    provider: session?.user?.provider || "",
  });


   
    
  

    useEffect(() => {
      async function fetchUserData() {
        try {
          const response = await fetch('/api/user/profile-data');
          if (!response.ok) throw new Error('Failed to fetch user data.');
    
          const user = await response.json();
          console.log('[Fetch User Data] User:', user);
    
          // Set adjustments and image data
          setFormData((prevState) => ({
            ...prevState,
            profileImage: user.profileImage
              ? `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}` // Decode BLOB
              : '',
            imageOffsetX: user.imageOffsetX || 0,
            imageOffsetY: user.imageOffsetY || 0,
            imageZoom: user.imageZoom || 1,
          }));
    
          setProfileImage(
            user.profileImage
              ? `data:image/png;base64,${Buffer.from(user.profileImage).toString('base64')}`
              : ''
          );
          console.log('[Fetch User Data for Image Agjustments] Applied Adjustments:', {
            offsetX: user.imageOffsetX,
            offsetY: user.imageOffsetY,
            zoom: user.imageZoom,
          });
        } catch (error) {
          console.error('[Fetch User Data Error]:', error);
        }
      }
    
      fetchUserData();
    }, []);
    

      /**
       * Handles the file input change, previews the image, and opens the modal.
       * @param event - Fetches profile data on component mount.
       * @returns   - User data from the server.
       */
      useEffect(() => {
        async function fetchUserData() {
          try {
            const response = await fetch('/api/user/profile-data');
            console.log('[Fetch User Data] Response:', response);
      
            if (!response.ok) {
              console.error('[Fetch User Data Error]:', response.status, response.statusText);
              throw new Error('Failed to fetch user data.');
            }
      
            // Parse JSON response
            const user = await response.json();
            console.log('[Fetch User Data] Parsed User Data:', user);
      
            // Handle date formatting
            const joinedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : 'N/A';
      
            const daysActive = user.createdAt
              ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)).toString()
              : '0';
      
            // Update formData state
            setFormData((prevState) => ({
              ...prevState,
              name: user.name || '',
              email: user.email || '',
              role: user.role || 'USER',
              userId: user.id || prevState.userId || '',
              joinedDate,
              daysActive,
              location: user.location || '',
              latitude: user.latitude || 0,
              longitude: user.longitude || 0,
              ipAddress: user.ipAddress || '',
              geodata: user.geodata || '',
              phone: user.phone || '',
              title: user.title || '',
              bio: user.bio || '',
              facebook: user.facebook || '',
              instagram: user.instagram || '',
              twitter: user.twitter || '',
              youtube: user.youtube || '',
              linkedin: user.linkedin || '',
              website: user.website || '',
              profileImage: user.profileImage || '',
              imageOffsetX: user.imageOffsetX || 0,
              imageOffsetY: user.imageOffsetY || 0,
              imageZoom: user.imageZoom || 1,
              provider: session?.user?.provider || "",
            }));
          } catch (error) {
            console.error('[Fetch User Data Error]:', error);
          }
        }
      //  GETS GEOLOCATION DATA
        async function fetchGeoLocation() {
          try {
            const { coords } = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
            );
      
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
            );
      
            if (!response.ok) {
              throw new Error('Failed to fetch geolocation data.');
            }
      
            const data = await response.json();
            const ipAddress = await fetchUserIP();
            console.log('[Inside GeoLocation Data]:', data);
            setFormData((prevState) => ({
              ...prevState,
              latitude: coords.latitude,
              longitude: coords.longitude,
              location: `${data.city || 'Unknown City'}, ${data.countryName || 'Unknown Country'}`,
              ipAddress: ipAddress || 'Unavailable',
            }));
              // Save geolocation data to the database
            await fetch('/api/user/update-geodata', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: formData.userId, // Ensure this is available
                geodata: JSON.stringify(data), // Serialize the JSON payload
              }),
            });
          } catch (error) {
            console.error('[GeoLocation Error]:', error);
          }
        }
      
        async function fetchUserIP() {
          try {
            const response = await fetch('https://api.ipify.org?format=json');
      
            if (!response.ok) {
              throw new Error('Failed to fetch user IP address.');
            }
      
            const data = await response.json();
            return data.ip;
          } catch (error) {
            console.error('[IP Fetch Error]:', error);
            return 'Unavailable';
          }
        }
      
        fetchUserData();
        fetchGeoLocation();
      }, []);
      


/**
 * 
 * @returns - The user's IP address.
 */
async function fetchUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('[IP Fetch Error]:', error);
      return 'Unavailable';
    }
  }


   
  /**
   * Fetches the user's geolocation data and IP address.
   * @returns - The user's geolocation data and IP address.
   * @throws  - An error if the geolocation data cannot be fetched.
   * @throws  - An error if the IP address cannot be fetched.
   * @returns - The user's geolocation data and IP address.
   * @throws  - An error if the geolocation data cannot be fetched.
   */
  async function fetchGeoLocation() {
    try {
      const { coords } = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
  
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
      );
  
      const data = await response.json();
      console.log('[Outside GeoLocation Data]:', data);
    
      const ipAddress = await fetchUserIP();

      

      setFormData((prevState) => ({
        ...prevState,
        latitude: coords.latitude,
        longitude: coords.longitude,
        location: `${data.city}, ${data.countryName}`,
        ipAddress,
      }));
      
      
  
      // Save geolocation data to the database
      await fetch('/api/user/update-geodata', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId, // Ensure this is available
          geodata: JSON.stringify(data), // Serialize the JSON payload

        }),
       
      });
    } catch (error) {
      console.error('[GeoLocation Error]:', error);
    }
  }
  
  
/**
 * Fetches the user's GEO location data and sets profile image
 */
  useEffect(() => {
    fetchGeoLocation();
    async function fetchProfileImage() {
      if (session?.user) {
        try {
          const res = await fetch('/api/user/profile-image');
          const { profileImage } = await res.json();
          setProfileImage(profileImage || '');
        } catch (error) {
          console.error('[Fetch Profile Image Error]:', error);
        }
      }
    }
    fetchProfileImage();
  }, [session]);


async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault(); // Prevent default form submission
  setIsUpdating(true); // Show updating state
  setMessage(''); // Clear any previous messages

  try {
    const updatedLocalData = {
      userId: formData.userId,
      location: formData.location,
      latitude: formData.latitude.toString(), 
      longitude: formData.longitude.toString(), 
      ipAddress: formData.ipAddress,
      daysActive: formData.daysActive,
      geodata: JSON.stringify({ city: formData.location.split(',')[0], country: formData.location.split(',')[1] }),
    };

    // Save profile image separately if available
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append('profileImage', imageFile);

      const imageResponse = await fetch('/api/user/profile-image', {
        method: 'PATCH',
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        const imageErrorData = await imageResponse.json();
        console.error('[Profile Image Update Error]', imageErrorData.message);
        throw new Error(imageErrorData.message || 'Failed to update profile image.');
      }
      console.log('[Profile Image Update Success]');
    }

    // Merge and sanitize formData
    const mergedData = { ...formData, ...updatedLocalData };
    const sanitizedData = Object.fromEntries(
      Object.entries(mergedData).filter(([_, value]) => value !== null && value !== '')
    );

    // Send all form data to `/api/user/update-profile`
    const response = await fetch('/api/user/update-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData),
    });

    console.log('[***Main Update Profile Response]:', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Update Error]', errorData.message);
      throw new Error(errorData.message || 'Failed to update profile.');
    }

    const data: UpdateResponse = await response.json();

    console.log('[Update Success]:', data);

    // Update local state with the latest server data
    setFormData((prevState) => ({
      ...prevState,
      ...data.user,
      latitude: parseFloat(data.user.latitude.toString()), 
      longitude: parseFloat(data.user.longitude.toString()), 
    }));

    setMessage('Profile updated successfully.');
  } catch (error: any) {
    console.error('[Update Error]:', error.message);
    setMessage(error.message || 'An unexpected error occurred.');
  } finally {
    setIsUpdating(false); // Reset updating state
  }
}


  /**
   * Handles the file input change, previews the image, and opens the modal.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setProfileImage(reader.result as string); // Set preview image
        setShowModal(true); // Open the modal for editing
      }
    };
    reader.readAsDataURL(file); // Convert file to Base64
  };



  /**
   * Handles saving the edited image from the modal and uploading it.
   */

  const handleSaveEditedImage = async (
    editedImage: string,
    adjustments: { offsetX: number; offsetY: number; zoom: number }
  ) => {
    console.log('[Handle Save Edited Image] Adjustments:', adjustments); // Debug log
    console.log('[Handle Save Edited Image] Edited Image Base64:', editedImage.slice(0, 100)); // Show partial base64
  
    setShowModal(false); // Close modal
    setProfileImage(editedImage); // Update the preview image
    setFormData((prevState) => ({
      ...prevState,
      profileImage: editedImage,
      imageOffsetX: adjustments.offsetX,
      imageOffsetY: adjustments.offsetY,
      imageZoom: adjustments.zoom,
    }));
  
    try {
      const response = await fetch('/api/user/save-image-adjustments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          offsetX: adjustments.offsetX,
          offsetY: adjustments.offsetY,
          zoom: adjustments.zoom,
          profileImage: editedImage, // Include the profile image in the request
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save profile image and adjustments.');
      }
  
      console.log('[Save Image Adjustments] Success:', await response.json()); // Debug success log
      setMessage('Profile image and adjustments saved successfully.');
    } catch (error: any) {
      console.error('[Save Adjustments Error]:', error.message);
      setMessage(error.message || 'An error occurred while saving adjustments.');
    }
  };
  
  

  /**
   * Uploads the profile image to the server.
   */
  const handleImageUpload = async (image: string) => {
    if (!imageFile) return;

    setIsUploading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/profile-image', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, userId: 'YOUR_USER_ID' }), // Replace YOUR_USER_ID dynamically
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image.');
      }

      setMessage('Profile image updated successfully.');
    } catch (error: any) {
      console.error('[Image Upload Error]:', error.message);
      setMessage(error.message || 'An error occurred while uploading.');
    } finally {
      setIsUploading(false);
    }
  };





  // Handle account deletion
  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/delete', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete account');

      setMessage('Account deleted successfully. Redirecting...');
      signOut({ callbackUrl: '/' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('[Delete Error]:', error.message);
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        console.error('[Delete Error]:', error);
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

    if (status === 'loading') return <p>Loading...</p>;
    return (
        <div className='flex min-h-screen flex-col items-center bg-background p-6 pt-24 text-foreground dark:bg-neutral-950 dark:text-neutral-100'>
            {/* Page Title */}
            <h1 className='mb-10 text-3xl font-bold'>Edit Profile</h1>

            <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile(e); 
                  }}
                className='w-full max-w-3xl space-y-8 rounded bg-card p-6 shadow-lg dark:bg-neutral-900'>
                {/* Top Section: Profile Header */}
                <div className='mb-8 flex items-center gap-6'>
                <div className="relative flex flex-col items-center">     
                     {/* Profile Image Preview */}
                     <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-card dark:border-neutral-700 shadow-md">
                        <img
                          src={profileImage || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="absolute"
                          style={{
                            objectFit: 'cover', // Ensure the image fills the circle
                            transform: `translate(${formData.imageOffsetX || 0}px, ${formData.imageOffsetY || 0}px) scale(${formData.imageZoom || 1})`,
                            transition: 'transform 0.3s ease-in-out', // Smooth adjustment transitions
                          }}
                          draggable={false} // Prevent browser drag events
                        />
                      </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        id="profileImageInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {/* Camera Button */}
                    <Button
                        type="button"
                        className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg transition hover:bg-primary-hover"
                        onClick={() => document.getElementById('profileImageInput')?.click()}
                    >
                        <Camera className="w-5 h-5 text-white" />
                    </Button>

                    {/* Image Editor Modal */}
                    {showModal && (
                        <ImageEditorModal
                        image={profileImage}
                        initialAdjustments={{
                            offsetX: formData.imageOffsetX,
                            offsetY: formData.imageOffsetY,
                            zoom: formData.imageZoom,
                        }}
                        onClose={() => setShowModal(false)}
                        onSave={(data) => handleSaveEditedImage(profileImage, data)}
                        />
                    )}
                </div>
                    

                    {/* General Info */}
                    <div className='flex flex-col space-y-2'>

                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                        Name
                    </label>
                    <div className="relative">
                        <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing.name}
                        onBlur={() => handleInputBlur('name')}
                        onKeyDown={(e) => handleKeyDown(e, 'name')}
                        className={`w-full rounded px-3 py-2 text-neutral-100 ${isEditing.name ? 'border border-primary bg-neutral-800 focus:ring-2 focus:ring-primary focus:outline-none' : 'bg-neutral-700'}`}
                         />
                        <Edit
                        onClick={() => handleEditClick('name')}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-primary"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-300">
                        Professional Title
                    </label>
                    <div className="relative">
                        <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        readOnly={!isEditing.title}
                        onBlur={() => handleInputBlur('title')}
                        onKeyDown={(e) => handleKeyDown(e, 'title')}
                        className={`w-full rounded px-3 py-2 text-neutral-100 ${isEditing.title ? 'border border-primary bg-neutral-800 focus:ring-2 focus:ring-primary focus:outline-none' : 'bg-neutral-700'}`}
                        />
                        <Edit
                        onClick={() => handleEditClick('title')}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-primary"
                        />
                    </div>
                    </div>



                        <p className='text-sm text-muted-foreground'>
                            Member since: {formData.joinedDate} • Days Active: {formData.daysActive} 
                        </p>
                    </div>
                </div>

                {/* General Information */}
                <Card className='space-y-4 p-4'>
                    <h3 className='text-lg font-semibold'>General Information</h3>
                    <div className='space-y-3'>
                        <div>
                            <label htmlFor='email' className='block text-sm text-muted-foreground'>
                                Email: 
                            </label>
                            <input
                                id='email'
                                type='email'
                                value={formData.email}
                                readOnly
                                className='w-full dark:bg-neutral-900 bg-muted-foreground/10'
                            />
                          
                        </div>
                        <div>
                            <label htmlFor='role' className='block text-sm text-muted-foreground'>
                                Role:    
                            </label>
                            <input
                                id='role'
                                type='text'
                                value={formData.role}
                                readOnly
                                className=' dark:bg-neutral-900 rounded bg-muted-foreground/10'
                                // className="w-full p-2 border rounded-lg dark:bg-neutral-800"
                            />
                        </div>
                        <div>
                            <label htmlFor='userId' className='block text-sm text-muted-foreground'>
                                User ID: 
                            </label>
                            <input
                                id='userId'
                                type='text'
                                value={formData.userId}
                                readOnly
                                className='w-full dark:bg-neutral-900 bg-muted-foreground/10'
                            />
                        </div>
                    </div>
                </Card>

                {/* Location */}
                <Card className='space-y-4 p-4'>
                    <h3 className='text-lg font-semibold'>Location</h3>
                    <div>
                        <label htmlFor='location' className='block text-sm text-muted-foreground'>
                            Location (City, Country)
                        </label>
                        <input
                            id='location'
                            type='text'
                            value={formData.location}
                            readOnly
                            className='w-full rounded  input-class dark:bg-neutral-900 bg-muted-foreground/10'
                        />
                    </div>
              
             <div className='grid  grid-cols-1 gap-4'>
              <label htmlFor='latitude' className='block text-sm'>
                IPAddress:  <input
                id='latitude'
                type='text'
                value={formData.ipAddress}
                readOnly
                className=' rounded w-full input-class dark:bg-neutral-900 bg-muted-foreground/10'
              />
              </label>
            
            </div>
          <h3 className='text-lg font-semibold'>GPS Details</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='latitude' className='block text-sm'>
                Latitude
              </label>
              <input
                id='latitude'
                type='text'
                value={formData.latitude}
                readOnly
                className='w-full rounded input-class dark:bg-neutral-900 bg-muted-foreground/10'
              />
            </div>
            <div>
              <label htmlFor='longitude' className='block text-sm'>
                Longitude
              </label>
              <input
                id='longitude'
                type='text'
                value={formData.longitude}
                readOnly
                className='w-full input-class dark:bg-neutral-900 bg-muted-foreground/10'
              />
            </div>
          </div>
        </Card>

                {/* Contact Information */}
                <Card className='space-y-4 p-4'>
                    <h3 className='text-lg font-semibold'>Contact Information</h3>
                    <div>
                        <label htmlFor='phone' className='block text-sm text-muted-foreground'>
                            Phone Number
                        </label>
                        <input
                            id='phone'
                            type='tel'
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className='w-full rounded border input-class dark:bg-neutral-800 bg-muted-foreground/10'
                        />
                    </div>
                </Card>

                {/* Professional Details */}
                <Card className='space-y-4 p-4'>
                    <h3 className='text-lg font-semibold'>Professional Details</h3>
                    <div>
                        <label htmlFor='title' className='block text-sm text-muted-foreground'>
                            Professional Title
                        </label>
                        <input
                            id='title'
                            type='text'
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className='w-full rounded border input-class dark:bg-neutral-800 bg-muted-foreground/10'
                        />
                    </div>
                    <div>
                        <label htmlFor='bio' className='block text-sm text-muted-foreground'>
                            Bio/Description
                        </label>
                        <textarea
                            id='bio'
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className='input-class w-full rounded border input-class dark:bg-neutral-800 bg-muted-foreground/10'
                        />
                    </div>
                </Card>

                {/* Social Links */}
                <Card className='space-y-4 p-4'>
                    <h3 className='text-lg font-semibold'>Social Links</h3>
                    {[
                        { id: 'facebook', label: 'Facebook', icon: Facebook },
                        { id: 'instagram', label: 'Instagram', icon: Instagram },
                        { id: 'twitter', label: 'Twitter', icon: Twitter },
                        { id: 'youtube', label: 'YouTube', icon: Youtube },
                        { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                        { id: 'website', label: 'Website', icon: Link }
                    ].filter(({ id }) => id !== 'password').map(({ id, label, icon: Icon }) => (
                        <div key={id} className='flex items-center gap-2'>
                            <Icon className='h-4 w-4 text-muted-foreground' />
                            <input
                                id={id}
                                type='text'
                                placeholder={label}
                                value={formData[id as keyof typeof formData] as string}
                                onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                                className='input-class w-full rounded border input-class dark:bg-neutral-800 bg-muted-foreground/10'
                            />
                        </div>
                    ))}
                </Card>

                <SecuritySection />
                {/* Danger Zone */}
                <Card className='space-y-4 bg-red-50 p-4 dark:bg-red-900'>
                    <h3 className='text-lg font-semibold text-red-600'>Danger Zone</h3>
                    <p className='text-sm text-muted-foreground'>
                        Deleting your account is irreversible. All data will be permanently removed.
                    </p>
                    <Button type='button' className='w-full bg-red-600' onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Card>

                {/* Save Changes */}
                <div className='flex justify-center'>
                    <Button type='submit' className='w-full max-w-sm bg-primary'>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
