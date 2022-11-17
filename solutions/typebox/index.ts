import { Static, TSchema } from "@sinclair/typebox"
import { Value } from '@sinclair/typebox/value'
import { Validators } from "../.."
import * as schemas from "./schemas"
import addFormats from 'ajv-formats'
import Ajv from 'ajv'

export function createAjv() {
    return addFormats(new Ajv({}), [
        'date-time',
        'date'
    ])
}

const ajv = createAjv()

type AdditionalValidator = (data: any) => void

const validator: (schema: TSchema, extraValidation?: AdditionalValidator) => ((data: any) => any) =
    (schema, extraValidation) => (
        (data) => {
            if (!ajv.validate(schema, data)) {
                throw (new Error(JSON.stringify(ajv.errors)))
            }
            if (extraValidation) {
                extraValidation(data)
            }
            Value.Cast(schema, data)
        }
    )

const validators: Validators = {
    person: validator(schemas.personSchema, (data => {
        // Can't perform this kind of validation via a json schema
        // Included here to pass the tests
        const dobTime = new Date(data.dob).getTime()
        const maximum = Date.now() - 24 * 60 * 60 * 1000 * 365 * 18
        if (dobTime > maximum) {
            throw new Error('Invalid date of birth')
        }
    })),
    driver: validator(schemas.driverSchema),
    fleet: validator(schemas.fleetSchema),
    vehicle: validator(schemas.vehicleSchema),
    personForm: validator(schemas.personFormSchema, (data => {
        // Can't perform this kind of validation via a json schema
        // Included here to pass the tests
        if (data.password !== data.repeatPassword) {
            throw new Error('Passwords do not match')
        }
    })),
}

export type Person = Static<typeof schemas.personSchema>
export type PersonFormInput = Static<typeof schemas.personFormSchema>
export type Driver = Static<typeof schemas.driverSchema>
export type Vehicle = Static<typeof schemas.vehicleSchema>
export type Fleet = Static<typeof schemas.fleetSchema>

export default validators