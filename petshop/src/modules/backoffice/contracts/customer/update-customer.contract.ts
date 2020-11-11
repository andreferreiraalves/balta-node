import { Injectable } from "@nestjs/common";
import { Flunt } from "src/utils/flunt";
import { UpdateCustomerDto } from "../../dtos/customer/update-customer.dto";
import { Contract } from "../constract";

@Injectable()
export class UpdateCustommerContract implements Contract {
    errors: any;

    validate(model: UpdateCustomerDto): boolean {
        const flunt = new Flunt();
        flunt.hasMinLen(model.name, 5, 'Nome inválido');

        this.errors = flunt.errors;
        return flunt.isValid();
    }
}