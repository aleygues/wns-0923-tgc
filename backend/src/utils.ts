import { MiddlewareFn } from "type-graphql";
import { ObjectId } from "./entities/ObjectId";
import { ContextType } from "./auth";

/**
 * This middle should be used on some user entity fields to make them private to the
 * current user
 * You should apply @Authorized on top of this middleware
 */
export const UserPrivateField: MiddlewareFn<ContextType> = async (
  { args, root, context },
  next
) => {
  if (context?.user?.id === root?.id) {
    return next();
  } else {
    return "";
  }
};

/**
 * Merge some data on an existing database entity, it takes care of keeping existing many-to-many relations to avoid unicity constraints
 * @param entity The base entity you want to merge your incomming data on (make sure to fetch many-to-many relations)
 * @param data The data payload you want to apply on your base entity (to update)
 * @returns The merged entity (the entity is updated as well)
 */
export function merge(entity: any, data: any): any {
  // should keep existing relations
  for (const [key, value] of Object.entries(data)) {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof ObjectId
    ) {
      if (!(key in entity)) {
        throw new Error(
          `missing key ${key} in your entity, did you forgot to fetch your relation?`
        );
      }
      if (Array.isArray(entity[key])) {
        data[key] = data[key].map((entry: ObjectId) => {
          const existingEntry = entity[key].find(
            (entityEntry: ObjectId) => entityEntry.id == entry.id
          );
          return existingEntry || entry;
        });
      }
    }
  }
  Object.assign(entity, data);
  return entity;
}
