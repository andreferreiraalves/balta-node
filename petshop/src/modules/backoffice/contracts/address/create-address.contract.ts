import { Injectable } from "@nestjs/common";
import { Address } from "src/modules/backoffice/models/address.model";
import { Flunt } from "src/utils/flunt";
import { Contract } from "../constract";

@Injectable()
export class CreateAddressContract implements Contract {
    errors: any;

    validate(model: Address): boolean {
        const flunt = new Flunt();
        flunt.isFixedLen(model.zipcode, 8, 'CEP inválido');
        flunt.hasMinLen(model.city, 3, 'Cidade inválida');

        this.errors = flunt.errors;
        return flunt.isValid();
    }
}