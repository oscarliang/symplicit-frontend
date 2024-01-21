import { schema } from 'normalizr';

export const carSchema = new schema.Entity('cars');

export const carListSchema = [carSchema];
