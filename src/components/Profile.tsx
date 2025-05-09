import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/sonner';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update displayName when currentUser changes
  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(displayName.trim());
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Display */}
        <div className="space-y-2">
          <Label>Email</Label>
          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleUpdateProfile}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(currentUser?.displayName || '');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentUser?.displayName || 'No display name set'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;