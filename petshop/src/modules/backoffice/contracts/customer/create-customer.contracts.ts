import { Injectable } from "@nestjs/common";
import { Flunt } from "src/utils/flunt";
import { CreateCustomerDto } from "../../dtos/customer/create-customer.dto";
import { Contract } from "../constract";

@Injectable()
export class CreateCustommerContract implements Contract {
    errors: any;

    validate(model: CreateCustomerDto): boolean {
        const flunt = new Flunt();
        flunt.hasMinLen(model.name, 5, 'Nome inválido');
        flunt.isEmail(model.email, 'E-mail inválido');
        flunt.isFixedLen(model.document, 11, 'CPF inválido');
        flunt.hasMinLen(model.password, 6, 'Senha inválida');

        this.errors = flunt.errors;
        return flunt.isValid();
    }
}