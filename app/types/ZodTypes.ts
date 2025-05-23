import {z} from "zod/v4"

export const ZodDate = z.iso.datetime({offset: true}).transform(value => new Date(value))