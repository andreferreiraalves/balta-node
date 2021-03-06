import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressType } from '../enums/address-type.enum';
import { Address } from '../models/address.model';
import { CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class AddressService {

    constructor(
        @InjectModel('Customer') private readonly model: Model<CustomerDocument>,
    ) { }

    async create(document: string, data: Address, type: AddressType): Promise<CustomerDocument> {
        const options = { upsert: true };

        if (type == AddressType.Billing) {
            return await this.model.findOneAndUpdate({ document }, {
                $set: {
                    billingAddress: data,
                }
            }, options);
        } else {
            return await this.model.findOneAndUpdate({ document }, {
                $set: {
                    shippingAddress: data,
                }
            }, options);
        }
    }
}