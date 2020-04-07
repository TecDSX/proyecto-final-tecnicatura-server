/* eslint-disable no-unused-vars */
import {
  tModels,
  iCreateUserInput,
  iLogin,
  iLoginInput,
  iUpdateUserInput,
  iAddFriend,
  iAddFriends,
} from '../../interfaces/index';
import { encrypt, createToken } from '../../utils/utils';
import { UserProps } from '../../models/User';
const existFriends = async (friendsIdArray: string[], User: any) => {
  const existFriends = await User.countDocuments({
    _id: friendsIdArray,
  });
  if (!(existFriends === friendsIdArray.length) || !(existFriends > 0))
    throw new Error('Some Friends not exists');
};
const existsUser = async (User: any, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not exists');
  return user;
};
const userFriendToSelf = (userId: any, friendsIdArray: any[]) => {
  friendsIdArray.map((id: any) => {
    // eslint-disable-next-line eqeqeq
    if (userId == id) throw new Error('User not can be friend to self');
  });
};
const existsFriendsInUser = async (
  User: any,
  userId: string,
  friendsIdArray: any[]
) => {
  const user = await existsUser(User, userId);
  userFriendToSelf(userId, friendsIdArray);
  const existsFriendInUser = user.friends.filter((id: any) => {
    // @ts-ignore
    // eslint-disable-next-line eqeqeq
    return friendsIdArray.map((friendId) => id === friendId);
  });
  if (existsFriendInUser.length > 0) throw new Error('Exists friend in User');
};
export default {
  User: {
    friends: async (
      { friends }: UserProps,
      _: any,
      { models: { User } }: { models: tModels }
    ) => {
      // @ts-ignore
      return await User.find({ _id: friends });
    },
  },
  Query: {
    getUsers: async (
      _: any,
      __: any,
      { models: { User } }: { models: tModels }
    ) => await User.find(),
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: iCreateUserInput,
      { models: { User } }: { models: tModels }
    ) => await User.create({ ...input, password: encrypt(input.password) }),
    login: async (
      _: any,
      { input }: iLoginInput,
      { models: { User } }: { models: tModels }
    ): Promise<iLogin> => {
      input.password = encrypt(input.password).toString();
      const user = await User.findOne(input);
      if (!user) throw new Error('Invalid Login');
      if (!user.active) throw new Error('Your account is not activated yet');
      // @ts-ignore
      const { password, ...data } = user._doc;
      return {
        token: await createToken({ ...data, token: password }),
      };
    },
    updateUser: async (
      _: any,
      { input, _id }: iUpdateUserInput,
      { models: { User } }: { models: tModels }
    ) => {
      if (input.password) input.password = encrypt(input.password).toString();
      // @ts-ignore
      if (input.friends && input.friends.length > 0) {
        await existsUser(User, _id);
        // @ts-ignore
        await existFriends(input.friends, User);
        await userFriendToSelf(_id, input.friends);
      }
      const userUpdated = await User.findOneAndUpdate(
        { _id },
        { $set: input },
        (err, data) => Promise.all([err, data])
      );
      if (!userUpdated) throw new Error('User not found');
      return userUpdated;
    },
    addFriend: async (
      _: any,
      { _id, friendId }: iAddFriend,
      { models: { User } }: { models: tModels }
    ) => {
      await existFriends([friendId], User);
      await existsFriendsInUser(User, _id, [friendId]);
      await User.updateOne(
        { _id },
        {
          $addToSet: { friends: friendId },
        }
      );
      return true;
    },
    addFriends: async (
      _: any,
      { _id, friendsIdArray }: iAddFriends,
      { models: { User } }: { models: tModels }
    ) => {
      await existFriends(friendsIdArray, User);
      await existsFriendsInUser(User, _id, friendsIdArray);
      await User.updateOne(
        { _id },
        {
          $addToSet: { friends: { $each: friendsIdArray } },
        }
      );
      return true;
    },
  },
};
