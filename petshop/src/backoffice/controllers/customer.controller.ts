import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCustommerContract } from '../contracts/customer.contracts';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Result } from '../models/result.model';

@Controller('v1/customers')
export class CustomerController {
    @Get()
    get() {
        return new Result(null, true, [], null);
    }

    @Get(':document')
    getById(@Param('document') document: string) {
        return new Result(null, true, {}, null);
    }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustommerContract()))
    post(@Body() body: CreateCustomerDto) {
        return new Result('Cliente alterado com sucesso', true, body, undefined);
    }

    @Put(':document')
    put(@Param('document') document: string, @Body() body) {
        return new Result('Cliente atualizado com sucesso', true, body, null);
    }

    @Delete(':document')
    delete(@Param('document') document: string) {
        return new Result('Cliente removido com sucesso', true, null, null);
    }
}