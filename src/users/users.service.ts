import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { MatchService } from 'src/match/match.service';
import { MatchStatus } from 'types/match';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly matchService: MatchService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('gymRelatedInterests')
      .populate('nonGymRelatedInterests')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
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
    const user = await this.findOne(user_id);

    const { gender } = user;
    const initiatedMatchUserIds =
      await this.matchService.listUserIdsByMatchStatusForUserId(
        user_id,
        MatchStatus.PENDING,
      );

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

    const allUserIdsFromMatching = [
      ...initiatedMatchUserIds,
      ...rejectedUserIds,
    ];

    const usersBasedOnMatching = await this.userModel
      .find({
        _id: {
          $nin: [...rejectedUserIds, ...alreadyMatchedUserIds],
          $in: initiatedMatchUserIds,
        },
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const restOfUsers = await this.userModel.find({
      _id: {
        $ne: user_id,
        $nin: allUserIdsFromMatching,
      },
      gender,
    });
    return [...usersBasedOnMatching, ...restOfUsers];
  }
}
