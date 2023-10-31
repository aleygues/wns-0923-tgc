import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { ObjectId } from "./entities/ObjectId";
import { BaseEntity } from "typeorm";

class EntityWithId extends BaseEntity {
  id!: number;
}

export function IsExisting(
  getEntity: () => typeof EntityWithId,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isExisting",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        async validate(value: ObjectId, args: ValidationArguments) {
          const Class = getEntity();
          const entry = await Class.findOneBy({
            id: value.id,
          });
          return !!entry;
        },
      },
    });
  };
}
