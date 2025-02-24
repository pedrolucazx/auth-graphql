import { profileRepository } from '../repositories/profile.repository';
import { userRepository } from '../repositories/user.repository';
import { Profile } from '../types/profiles.types';
import { User, UserFilter, UserInput } from '../types/users.types';
import { handleError } from '../utils/handleError';

export const userService = {
  getAllUsers: async (): Promise<Omit<User, 'senha'>[] | undefined> => {
    try {
      const users = await userRepository.getAllUsers();
      if (!users?.length) throw new Error('No users found');
      return users?.map(({ senha, ...user }) => user);
    } catch (error) {
      handleError('Error fetching users:', error);
    }
  },

  getUserByParams: async (params: UserFilter): Promise<User | undefined> => {
    try {
      if (!Object.keys(params).length) {
        throw new Error('At least one parameter must be provided.');
      }

      const user = await userRepository.getUserByParams(params);
      if (!user) throw new Error('User not found.');

      return user;
    } catch (error) {
      handleError('Error fetching user by parameters:', error);
    }
  },

  createUser: async (data: UserInput): Promise<User | undefined> => {
    try {
      const { perfis, ...user } = data;

      if (Object.values(user).some((value) => !value)) {
        throw new Error('User data is incomplete or invalid.');
      }

      if (perfis?.length) {
        for (const { id } of perfis) {
          const profile = await profileRepository.getProfileByParams({ id });
          if (!profile) throw new Error('Profile not found.');
        }
      }

      const createdUser = await userRepository.createUser(user);
      if (!createdUser) throw new Error('Failed to create user.');

      if (perfis?.length) {
        for (const { id } of perfis) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: createdUser.id,
            perfil_id: id!,
          });

          if (!assignedProfile) {
            throw new Error('Failed to associate profiles to user.');
          }
        }
      }

      return createdUser;
    } catch (error) {
      handleError('Error creating user:', error);
    }
  },

  updateUser: async (
    id: number,
    data: UserInput,
  ): Promise<User | undefined> => {
    try {
      const { perfis, ...user } = data;
      if (!id || !user || !Object.keys(user).length) {
        throw new Error('Invalid user data or ID.');
      }

      if (perfis?.length) {
        for (const { id } of perfis) {
          const profile = await profileRepository.getProfileByParams({ id });
          if (!profile) throw new Error('Profile not found.');
        }
      }

      const updatedUser = await userRepository.updateUser(id, user);
      if (!updatedUser) {
        throw new Error(`No user found with ID ${id} to update.`);
      }

      if (perfis?.length) {
        await userRepository.unassignProfile(id);
        for (const { id } of perfis) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: updatedUser?.id,
            perfil_id: id!,
          });

          if (!assignedProfile) {
            throw new Error('Failed to associate profiles to user.');
          }
        }
      }

      return updatedUser;
    } catch (error) {
      handleError(`Error updating user with ID ${id}:`, error);
    }
  },

  deleteUser: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new Error('User ID is required.');
      }

      const deletedRows = await userRepository.deleteUser(id);
      if (!deletedRows) {
        throw new Error(`No user found with ID ${id} to delete.`);
      }

      return `User with ID ${id} was successfully deleted.`;
    } catch (error) {
      handleError(`Error deleting user with ID ${id}:`, error);
    }
  },

  getUserProfiles: async (userId: number): Promise<Profile[] | undefined> => {
    try {
      if (!userId) {
        throw new Error('User ID is required.');
      }
      return await userRepository.getUserProfiles(userId);
    } catch (error) {
      handleError(`Error get profiles user with ID ${userId}:`, error);
    }
  },
};
