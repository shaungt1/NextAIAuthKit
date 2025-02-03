'use client';

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card } from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import Link from "next/link";
import ImageEditorModal from '@/components/ImageEditorModal';
import {
  Settings,
  LogOut,
  Edit3,
  Camera,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Link as ExternalLink,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth/login";
    },
  });
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isUploading, setIsUploading] = useState(false);
  const [geoLocation, setGeoLocation] = useState({ city: '', country: '' });
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [activeButton, setActiveButton] = useState("");
 
  const [profileData, setProfileData] = useState({
    userId: '',
    name: session?.user?.name || "N/A",
    email: session?.user?.email || "No email provided",
    image: session?.user?.image || "",
    role: session?.user?.role || "N/A",
    location: "",
    phone: "",
    joinedDate: "",
    latitude: 0,
    longitude: 0,
    ipAddress: "",
    title: "",
    bio: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    website: "",
    daysActive: "",
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

        
            // Handle date formatting
            const joinedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : 'N/A';
            console.log('[Fetch User Data] Joined Date:', joinedDate); // Debug log
  
        // Set adjustments and image data
        setProfileData((prevState) => ({
          ...prevState,
          joinedDate,
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
    setProfileData((prevState) => ({
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
          userId: profileData.userId,
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


  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch("/api/user/profile-data");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }
        const data = await response.json();
        setProfileData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        if (error instanceof Error) {
          console.error("[ProfilePage Fetch Error]:", error.message);
        } else {
          console.error("[ProfilePage Fetch Error]:", error);
        }
      }
    }

    fetchProfileData();
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <p>
          You are not logged in. <a href="/auth/login">Login</a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 text-foreground dark:text-neutral-100 p-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mt-12 mb-6">
        <div className="relative">   
          {/* Profile Image Preview */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-card dark:border-neutral-700 shadow-md">
            <img
              src={profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="absolute"
              style={{
                objectFit: 'cover', // Ensure the image fills the circle
                transform: `translate(${profileData.imageOffsetX || 0}px, ${profileData.imageOffsetY || 0}px) scale(${profileData.imageZoom || 1})`,
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
                  offsetX: profileData.imageOffsetX,
                  offsetY: profileData.imageOffsetY,
                  zoom: profileData.imageZoom,
              }}
              onClose={() => setShowModal(false)}
              onSave={(data) => handleSaveEditedImage(profileImage, data)}
              />
          )}
               </div>
        </div>
      {/* Profile data name and title */}
      <Card className="w-full max-w-3xl mx-auto bg-card dark:bg-neutral-900 p-8 shadow-xl rounded-2xl">
        {/* Name and Role */}
        <div className="text-center mt-3 mb-6">
          <h1 className="text-3xl font-bold">{profileData.name}</h1>
          <p className="text-sm text-muted-foreground">{profileData.role}</p>
        </div>

        {/* General Information */}
        <div className="space-y-4">
          <div className="flex items-center text-sm space-x-2">
            <MapPin className="text-secondary dark:text-primary-foreground" />
            <span>{profileData.location || "Location not provided"}</span>
          </div>
          <div className="flex items-center text-sm space-x-2">
            <Mail className="text-secondary dark:text-primary-foreground" />
            <span>{profileData.email}</span>
          </div>
          <div className="flex items-center text-sm space-x-2">
            <Phone className="text-secondary dark:text-primary-foreground" />
            <span>{profileData.phone || "Phone not provided"}</span>
          </div>
          <div className="flex items-center text-sm space-x-2">
            <Calendar className="text-secondary dark:text-primary-foreground" />
            <span>Joined {profileData.joinedDate} </span>
          </div>
        </div>

        <hr className="my-6 border-border dark:border-neutral-700" />

        {/* Professional Details */}
        <div>
          <h2 className="text-lg font-semibold">Professional Details</h2>
          <p>Title: {profileData.title || "No title set"}</p>
          <p>Bio: {profileData.bio || "No bio available"}</p>
        </div>

        <hr className="my-6 border-border dark:border-neutral-700" />

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-semibold">Social Links</h2>
          {[
            { label: "Facebook", value: profileData.facebook, icon: Facebook },
            { label: "Instagram", value: profileData.instagram, icon: Instagram },
            { label: "Twitter", value: profileData.twitter, icon: Twitter },
            { label: "YouTube", value: profileData.youtube, icon: Youtube },
            { label: "LinkedIn", value: profileData.linkedin, icon: Linkedin },
            { label: "Website", value: profileData.website, icon: ExternalLink },
          ].map(({ label, value, icon: Icon }, index) => (
            <div key={index} className="flex items-center text-sm space-x-2">
              <Icon className="text-secondary dark:text-primary-foreground" />
              <span>{value || `${label} not provided`}</span>
            </div>
          ))}
        </div>

        <hr className="my-6 border-border dark:border-neutral-700" />

        {/* GPS & IP Details */}
        <div>
          <h2 className="text-lg font-semibold">GPS & IP Details</h2>
          <p>Latitude: {profileData.latitude || "N/A"}</p>
          <p>Longitude: {profileData.longitude || "N/A"}</p>
          <p>IP Address: {profileData.ipAddress || "N/A"}</p>
        </div>

        <hr className="my-6 border-border dark:border-neutral-700" />

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <Link href="/profile/edit-profile">
            <Button
              variant="default"
              className={`w-full flex justify-center space-x-2 hover:shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 ${
                activeButton === "edit-profile" ? "bg-[#C70039]" : ""
              } transition-all duration-300`}
              onClick={() => handleButtonClick("edit-profile")}
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Profile</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className={`w-full flex justify-center space-x-2 hover:shadow-lg ${
              activeButton === "settings" ? "bg-[#C70039]" : ""
            } transition-all duration-300`}
            onClick={() => handleButtonClick("settings")}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
          <Button
            variant="destructive"
            className={`w-full flex justify-center space-x-2 hover:shadow-lg ${
              activeButton === "sign-out" ? "bg-[#C70039]" : ""
            } transition-all duration-300`}
            onClick={() => {
              handleButtonClick("sign-out");
              signOut();
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
