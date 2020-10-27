import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { Query } from 'mongoose';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateAddressContract } from '../contracts/customer/create-address.contract';
import { CreateCustommerContract } from '../contracts/customer/create-customer.contracts';
import { CreatePetContract } from '../contracts/customer/create-pet.contract';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { QueryDto } from '../dtos/query.dto';
import { Address } from '../models/address.model';
import { Customer } from '../models/customer.model';
import { Pet } from '../models/pet.model';
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

    @Post(':document/address/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBilingAdress(@Param('document') document: string, @Body() model: Address) {
        try {
            const res = this.customerService.addBillingAdress(document, model);
            return res;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Post(':document/address/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAdress(@Param('document') document: string, @Body() model: Address) {
        try {
            this.customerService.addShippingAdress(document, model);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Post(':document/pets')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document: string, @Body() model: Pet) {
        try {
            this.customerService.createPet(document, model);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu animal ;)', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Put(':document/pets/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document: string, id: string, @Body() model: Pet) {
        try {
            this.customerService.updatePet(document, id, model);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível atualizar seu animal ;)', false, undefined, error), HttpStatus.BAD_REQUEST)
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