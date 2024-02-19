import { Intent, Position, Toaster } from '@blueprintjs/core';

/** Singleton toaster instance. Create separate instances for different options. */
export const CommonToaster = Toaster.create({
  position: Position.TOP,
}); 

export const CommonToasterInstance = () =>
  Toaster.create({
    position: Position.TOP,
    className: 'toast-container',
  });

export const SuccessToaster = (message) =>
  CommonToaster.show({
    message,
    intent: Intent.PRIMARY,
    icon: 'tick',
    timeout: 2000,
  });

export const ErrorToaster = (message) =>
  CommonToaster.show({
    message,
    intent: Intent.DANGER,
    icon: 'error',
    timeout: 2000,
  });
