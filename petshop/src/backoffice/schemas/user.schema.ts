import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../models/user.model';

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = UserS & Document;

// @Schema()
// export class UserS {
//     @Prop({
//         required: true,
//         trim: true,
//         index: {
//             unique: true,
//         },
//     })
//     username: string;

//     @Prop({
//         required: true,
//         trim: true,
//     })
//     password: String;

//     @Prop({
//         required: true,
//         default: true,
//     })
//     active: Boolean;
// }

// export const UserSchema = SchemaFactory.createForClass(UserS);

export type UserDocument = User & Document;

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
});