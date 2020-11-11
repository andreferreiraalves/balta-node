import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { QueryDto } from '../dtos/query.dto';
import { CreditCard } from '../models/credit-card.model';
import { Customer } from '../models/customer.model';
import { CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomerService {

    constructor(
        @InjectModel('Customer') private readonly model: Model<CustomerDocument>,
    ) { }

    async create(data: Customer): Promise<CustomerDocument> {
        const user = new this.model(data);
        return await user.save();
    }

    async findAll(): Promise<Customer[]> {
        return await this.model
            .find({}, 'name email document')
            .sort('name')
            // .sort('-name') decrescente
            .exec();
        // return await this.model.find({}, '-name').exec(); remove só o nome
    }

    async find(document: string): Promise<Customer> {
        return await this.model.findOne({ document })
            .populate('user', 'username')
            .exec();
    }

    async query(model: QueryDto): Promise<Customer[]> {
        return await this.model
            .find(model.query, model.fields,
                { skip: model.skip, limit: model.take }
            )
            .sort(model.sort)
            .exec();
    }

    async update(document: string, data: UpdateCustomerDto): Promise<Customer> {
        return await this.model.findOneAndUpdate({ document }, data);
    }

    async saveOrUpdateCredCard(document: string, data: CreditCard): Promise<Customer> {
        const options = { upsert: true };

        return await this.model.findOneAndUpdate({ document }, {
            $set: {
                card: data,
            },
        }, options);
    }
}