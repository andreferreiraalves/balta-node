import { Body, Controller, HttpException, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateAddressContract } from '../contracts/customer/create-address.contract';
import { AddressType } from '../enums/address-type.enum';
import { Address } from '../models/address.model';
import { Result } from '../models/result.model';
import { AddressService } from '../services/address.service';

@Controller('v1/address')
export class AddressController {

    constructor(
        private readonly service: AddressService,
    ) { }

    @Post(':document/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBilingAdress(@Param('document') document: string, @Body() model: Address) {
        try {
            const res = this.service.create(document, model, AddressType.Billing);
            return res;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Post(':document/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAdress(@Param('document') document: string, @Body() model: Address) {
        try {
            this.service.create(document, model, AddressType.Shipping);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }
}