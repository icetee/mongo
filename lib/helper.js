'use babel';

import { File } from 'atom';

export const hasProject = () => atom.project && atom.project.getPaths().length;
export const readConfig = async () => {
  if (!hasProject) return false;

  const configFile = new File(`${atom.project.getPaths()[0]}/.mongoconfig`);
  const config = await configFile.read(true);

  try {
    return JSON.parse(config);
  } catch (e) {
    atom.notifications.addWarning('Mongo: Invalid JSON config', {
      dismissable: true,
      detail: e,
    });
  }

  return false;
};
