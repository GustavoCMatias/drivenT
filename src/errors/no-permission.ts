import { ApplicationError } from '@/protocols';

export function noPermission(): ApplicationError {
  return {
    name: 'NoPermission',
    message: 'User does not have permission to acess this information!',
  };
}
