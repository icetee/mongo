'use babel';

export const hasProject = () => atom.project && atom.project.getPaths().length;

export const commands = (cmd) => {
  atom.commands.dispatch(atom.views.getView(atom.workspace), cmd);
};

export const getSelectedProject = () => {
  const mainModule = atom.packages.getActivePackage('tree-view').mainModule;
  const paths = mainModule.treeView.roots.filter(elem => elem.classList.contains('selected'));

  if (paths.length === 0) return atom.project.getPaths()[0];

  return paths[0].getPath();
};
