import { Option } from 'commander'

export interface ICLIOption extends Option {
    helpLevel?: string
}
