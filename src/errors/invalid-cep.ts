import { ApplicationError } from '@/protocols';

export function InvalidCEPError(): ApplicationError {
  return {
    name: 'InvalidCEP',
    message: 'This CEP does not exist!',
  };
}
