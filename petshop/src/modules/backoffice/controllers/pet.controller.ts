import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreatePetContract } from '../contracts/customer/create-pet.contract';
import { Pet } from '../models/pet.model';
import { Result } from '../models/result.model';
import { PetService } from '../services/pet.service';

@Controller('v1/pets')
export class PetController {

    constructor(
        private readonly service: PetService,
    ) { }

    @Post(':document/')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document: string, @Body() model: Pet) {
        try {
            this.service.createPet(document, model);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível adicionar seu animal ;)', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }

    @Put(':document/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document: string, id: string, @Body() model: Pet) {
        try {
            this.service.update(document, id, model);
            return model;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Não foi possível atualizar seu animal ;)', false, undefined, error), HttpStatus.BAD_REQUEST)
        }
    }
}