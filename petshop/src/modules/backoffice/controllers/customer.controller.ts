import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCustommerContract } from '../contracts/customer/create-customer.contracts';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { QueryDto } from '../dtos/query.dto';
import { Customer } from '../models/customer.model';
import { Result } from '../models/result.model';
import { User } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';

@Controller('v1/customers')
export class CustomerController {

    constructor(
        private readonly accountService: AccountService,
        private readonly customerService: CustomerService,
    ) { }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustommerContract()))
    async post(@Body() model: CreateCustomerDto) {
        let user: User;
        let customer: Customer;

        try {
            user = await this.accountService.create(new User(model.document, model.password, true));
            customer = new Customer(model.name, model.document, model.email, null, null, null, null, user);
            const res = await this.customerService.create(customer);
            return new Result('Cliente criado com sucesso', true, res, undefined);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível realizar o cadastro', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Get()
    async getAll() {
        return await this.customerService.findAll();
    }

    @Get(':document')
    async get(@Param('document') document: string) {
        return await this.customerService.find(document);
    }

    @Post('query')
    async query(@Body() model: QueryDto) {
        return await this.customerService.query(model);
    }
}