import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AccountService {

    constructor(
        @InjectModel('User') private readonly model: Model<UserDocument>,
    ) { }

    async create(data: User): Promise<UserDocument> {
        const user = new this.model(data);
        return await user.save();
    }
}