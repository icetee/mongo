'use babel';

export const isInvalidJSONConfig = (params) => {
  const options = Object.assign({
    dismissable: true,
  }, params.options);

  atom.notifications.addWarning('Mongo: Incorrect JSON config', options);
};

export const basicNotification = (params, type = 'Warning') => {
  const options = Object.assign({
    dismissable: true,
  }, params);

  const message = (params.message) ? `Mongo: ${params.message}` : 'Mongo: Something is not right';
  atom.notifications[`add${type}`](message, options);
};
