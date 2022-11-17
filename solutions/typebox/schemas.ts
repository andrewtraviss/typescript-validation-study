import { Type } from '@sinclair/typebox'
import { Format } from '@sinclair/typebox/format'

export enum SexOptions {
    M = 'M',
    F = 'F',
    O = 'O'
}

export const personSchema = Type.Object({
    name: Type.String({
        minLength: 3,
        maxLength: 20,
        pattern: '^[a-z A-Z ]+$'
    }),
    dob: Type.Union([
        Type.String({format: 'date', default: null}),
        Type.String({format: 'date-time', default: null})
    ]),
    sex: Type.Optional(Type.Enum(SexOptions, { default: SexOptions.M })),
    password: Type.String({ minLength: 5 })
})

export const personFormSchema = Type.Intersect([
    personSchema,
    Type.Object({
        repeatPassword: Type.String({ minLength: 5 })
    })
])

export const driverSchema = Type.Intersect([
    personSchema,
    Type.Object({
        licenseNo: Type.String({
            minLength: 3,
            maxLength: 30,
            pattern: '^[a-zA-Z]+$'
        })
    })
])

export const vehicleSchema = Type.Object({
    type: Type.Union([
        Type.Literal('car'),
        Type.Literal('bus')
    ]),
    seats: Type.Integer({ minimum: 1 }),
    length: Type.Number({ exclusiveMinimum: 0 })
})

export const fleetSchema = Type.Array(Type.Object({
    driver: driverSchema,
    vehicle: vehicleSchema
}))