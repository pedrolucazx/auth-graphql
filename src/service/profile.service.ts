import { handleError } from '@/utils/handleError';
import { profileModel } from '../models/profile.model';
import { Profile, ProfileService } from '../types/profiles.types';

export const profileService: ProfileService = {
  getAllProfiles: async (): Promise<Profile[] | undefined> => {
    try {
      const profiles = await profileModel.getAllProfiles();
      if (!profiles?.length) {
        throw new Error('No profiles found.');
      }
      return profiles;
    } catch (error) {
      handleError('Error fetching profiles:', error);
    }
  },

  getProfileByParams: async (
    params: Partial<Profile>,
  ): Promise<Profile | undefined> => {
    try {
      if (!Object.keys(params).length) {
        throw new Error('At least one parameter must be provided.');
      }
      const profile = await profileModel.getProfileByParams(params);
      if (!profile) {
        throw new Error('Profile not found.');
      }
      return profile;
    } catch (error) {
      handleError('Error fetching profile by parameters:', error);
    }
  },

  createProfile: async (profile: Profile): Promise<Profile | undefined> => {
    try {
      if (!profile || !profile.nome) {
        throw new Error('Profile data is incomplete or invalid.');
      }

      const id = await profileModel.createProfile(profile);
      if (!id) throw new Error('Failed to create profile.');

      return await profileModel.getProfileByParams({ id })!;
    } catch (error) {
      handleError('Error creating profile:', error);
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<Profile | undefined> => {
    try {
      if (!id || !profile || !Object.keys(profile).length) {
        throw new Error('Invalid profile data or ID.');
      }

      const updatedRows = await profileModel.updateProfile(id, profile);

      if (!updatedRows) {
        throw new Error(`No profile found with ID ${id} to update.`);
      }

      return await profileModel.getProfileByParams({ id })!;
    } catch (error) {
      handleError(`Error updating profile with ID ${id}:`, error);
    }
  },

  deleteProfile: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new Error('Profile ID is required.');
      }

      const deletedRows = await profileModel.deleteProfile(id);
      if (!deletedRows) {
        throw new Error(`No profile found with ID ${id} to delete.`);
      }

      return `Profile with ID ${id} was successfully deleted.`;
    } catch (error) {
      handleError(`Error deleting profile with ID ${id}:`, error);
    }
  },
};
