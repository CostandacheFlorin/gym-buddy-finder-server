import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user/update-user.dto';
import { MatchService } from 'src/match/match.service';
import { MatchStatus } from 'types/match';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly matchService: MatchService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const newUser = new this.userModel(data);
    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .exec();

    return user;
  }

  async findOne(query: FilterQuery<User>): Promise<User> {
    const user = await this.userModel
      .findOne(query)
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .exec();

    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ _id: id })
      .exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async findUsersWithMatchersFirst(
    user_id: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<User[]> {
    const user = await this.findOneById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    const { gender } = user;

    const initiatedMatchUserIds =
      await this.matchService.listMatchingUserIdsForUserId(user_id);

    const rejectedUserIds =
      await this.matchService.listUserIdsByMatchStatusForUserId(
        user_id,
        MatchStatus.REJECTED,
      );

    const alreadyMatchedUserIds =
      await this.matchService.listUserIdsByMatchStatusForUserId(
        user_id,
        MatchStatus.MATCHED,
      );

    const pendingMatchingUserIds =
      await this.matchService.listUserIdsByMatchStatusForUserId(
        user_id,
        MatchStatus.PENDING,
      );

    const allUserIdsFromMatching = [
      ...initiatedMatchUserIds,
      ...rejectedUserIds,
      ...alreadyMatchedUserIds,
      ...pendingMatchingUserIds,
    ];

    const usersThatWantToMatch = await this.userModel
      .find({
        _id: { $in: initiatedMatchUserIds },
      })
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .skip(skip)
      .limit(limit)
      .exec();

    // Calculate the number of users to skip in the remaining list
    const restSkip = Math.max(skip - usersThatWantToMatch.length, 0);
    const restLimit = Math.max(limit - usersThatWantToMatch.length, 0);

    // Fetch the rest of the users
    const restOfUsers = await this.userModel
      .find({
        _id: {
          $ne: user_id,
          $nin: allUserIdsFromMatching,
        },
        gender,
      })
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .skip(restSkip)
      .limit(restLimit)
      .exec();

    // Combine the lists
    return [...usersThatWantToMatch, ...restOfUsers];
  }
}
