import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/registry/new-york/ui/button";
import { Card } from "@/registry/new-york/ui/card";
import { useToast } from "@/registry/new-york/hooks/use-toast";

/**
 * SecuritySection Component
 * - Handles user password updates for email-based accounts.
 * - Displays appropriate UI for email-based or social logins.
 */
export default function SecuritySection() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.warn("[SecuritySection] User is unauthenticated. Redirecting to login.");
      window.location.href = "/auth/login";
    },
  });
console.log('session for AUTH',session)

  const { toast } = useToast();

  // State for form data, initialized with the session provider
  const [formData, setFormData] = useState({
    provider: session?.user?.provider || "", // Default to an empty string
  });
console.log('formData for AUTH',formData)
  // State for password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  /**
   * Validates password change fields.
   * @returns {boolean} - True if all fields are valid and passwords match.
   */
  const isPasswordChangeValid = () => {
    const isValid =
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword === passwordData.confirmPassword;

    console.log("[Password Validation] Is Valid:", isValid);
    return isValid;
  };

  /**
   * Handles the password change request.
   * - Sends data to the backend and displays a toast based on the response.
   */
  const handlePasswordChange = async () => {
    console.log("[Password Change] Initiating password change...");
    if (!isPasswordChangeValid()) {
      console.error("[Password Change] Validation failed: Passwords do not match or fields are incomplete.");
      toast({
        title: "Error",
        description: "Passwords do not match or fields are incomplete.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);

      console.log("[Password Change] Sending request to /api/user/update-password...");
      const response = await fetch("/api/user/update-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      console.log("[Password Change] Response:", response);
      const result = await response.json();

      if (!response.ok) {
        console.error("[Password Change] Server returned an error:", result.message);
        throw new Error(result.message || "Failed to update password.");
      }

      console.log("[Password Change] Password updated successfully.");
      toast({
        title: "Success",
        description: "Password updated successfully.",
        variant: "default",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("[Password Change Error]:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Effect to debug and ensure provider is correctly set
  useEffect(() => {
    if (session) {
      console.log("[Session Data]:", session);
      if (session.user) {
        console.log("[Session User Provider]:", session.user.provider);
        setFormData((prev) => ({
          ...prev,
          provider: session.user.provider || "",
        }));
      } else {
        console.warn("[Session] User object is missing.");
      }
    } else {
      console.warn("[Session] Session data is not available.");
    }
  }, [session]);

  if (status === "loading") {
    console.log("[SecuritySection] Session status: loading...");
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {formData.provider === "credentials" ? (
        <Card className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-red-600">Security</h3>
          <div>
            <label htmlFor="currentPassword" className="block text-sm text-muted-foreground">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="input-class w-full rounded border input-class dark:bg-zinc-800 bg-muted-foreground/10"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm text-muted-foreground">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="input-class w-full rounded border input-class dark:bg-zinc-800 bg-muted-foreground/10"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-muted-foreground">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="input-class w-full rounded border input-class dark:bg-zinc-800 bg-muted-foreground/10"
            />
          </div>
          <Button
            type="button"
            className="w-full bg-primary"
            onClick={handlePasswordChange}
            disabled={!isPasswordChangeValid()}
          >
            Update Password
          </Button>
        </Card>
      ) : (
        <Card className="space-y-4 p-4">
          <h3 className="text-lg font-semibold text-muted-foreground">Security</h3>
          <p className="text-sm text-muted-foreground">
            Password changes are not supported for social logins.
          </p>
        </Card>
      )}
    </div>
  );
}
