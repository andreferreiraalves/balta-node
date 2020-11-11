import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCreditCardContract } from '../contracts/customer/create-creditcard.contract';
import { CreateCustommerContract } from '../contracts/customer/create-customer.contracts';
import { UpdateCustommerContract } from '../contracts/customer/update-customer.contract';
import { QueryContract } from '../contracts/query.contract';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { QueryDto } from '../dtos/query.dto';
import { CreditCard } from '../models/credit-card.model';
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
    @UseInterceptors(new ValidatorInterceptor(new QueryContract()))
    async query(@Body() model: QueryDto) {
        return await this.customerService.query(model);
    }

    @Put(':document')
    @UseInterceptors(new ValidatorInterceptor(new UpdateCustommerContract()))
    async updateCustomer(@Param('document') document: string, @Body() model: UpdateCustomerDto) {
        try {
            const res = await this.customerService.update(document, model);
            return new Result('Cliente atualizado com sucesso', true, res, undefined);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível realizar a atualização', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Put(':document')
    @UseInterceptors(new ValidatorInterceptor(new CreateCreditCardContract()))
    async createCreditCard(@Param('document') document: string, @Body() model: CreditCard) {
        try {
            const res = await this.customerService.saveOrUpdateCredCard(document, model);
            return new Result(null, true, res, undefined);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível realizar a atualização', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }
}