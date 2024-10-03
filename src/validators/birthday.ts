import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidAgeConstraint implements ValidatorConstraintInterface {
  validate(birthDate: Date, args: ValidationArguments) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    const isBeforeBirthdayThisYear =
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate());

    const calculatedAge = isBeforeBirthdayThisYear ? age - 1 : age;

    // Check if age is between 13 and 100
    return calculatedAge >= 13 && calculatedAge <= 100;
  }

  defaultMessage(args: ValidationArguments) {
    const birthDate = new Date(args.value);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (age < 0) {
      return 'Blud thinks he is born in the future.';
    } else if (age < 13) {
      return 'You must be at least 13 years old to register.';
    } else if (age > 100) {
      return 'Bro at your age just chill out, no one trying to get benched by someone who is over 100 years old 💀';
    }
    return 'Invalid age.';
  }
}

export function IsValidAge(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidAgeConstraint,
    });
  };
}
