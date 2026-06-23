import angularUrl from '../../assets/images/cards/code-vibes/logos/angular.svg';
import bootstrapUrl from '../../assets/images/cards/code-vibes/logos/bootstrap.svg';
import cssUrl from '../../assets/images/cards/code-vibes/logos/css.svg';
import databaseUrl from '../../assets/images/cards/code-vibes/logos/database.svg';
import djangoUrl from '../../assets/images/cards/code-vibes/logos/django.svg';
import firebaseUrl from '../../assets/images/cards/code-vibes/logos/firebase.svg';
import gitUrl from '../../assets/images/cards/code-vibes/logos/git.svg';
import githubUrl from '../../assets/images/cards/code-vibes/logos/github.svg';
import htmlUrl from '../../assets/images/cards/code-vibes/logos/html.svg';
import javascriptUrl from '../../assets/images/cards/code-vibes/logos/javascript.svg';
import nodeUrl from '../../assets/images/cards/code-vibes/logos/node.svg';
import pythonUrl from '../../assets/images/cards/code-vibes/logos/python.svg';
import reactUrl from '../../assets/images/cards/code-vibes/logos/react.svg';
import scssUrl from '../../assets/images/cards/code-vibes/logos/scss.svg';
import terminalUrl from '../../assets/images/cards/code-vibes/logos/terminal.svg';
import typescriptUrl from '../../assets/images/cards/code-vibes/logos/typescript.svg';
import vscodeUrl from '../../assets/images/cards/code-vibes/logos/vscode.svg';
import vueUrl from '../../assets/images/cards/code-vibes/logos/vue.svg';

import type { CardDefinition } from '../types/card.types';

/**
 * Code Vibes card definitions used to build matching pairs.
 *
 * The exported data is consumed when creating theme-specific memory card pairs.
 */
export const codeVibesCards: CardDefinition[] = [
  { id: 'angular', label: 'Angular', image: angularUrl },
  { id: 'typescript', label: 'TypeScript', image: typescriptUrl },
  { id: 'javascript', label: 'JavaScript', image: javascriptUrl },
  { id: 'html', label: 'HTML', image: htmlUrl },
  { id: 'vscode', label: 'Visual Studio Code', image: vscodeUrl },
  { id: 'css', label: 'CSS', image: cssUrl },
  { id: 'django', label: 'Django', image: djangoUrl },
  { id: 'terminal', label: 'Terminal', image: terminalUrl },
  { id: 'python', label: 'Python', image: pythonUrl },
  { id: 'github', label: 'GitHub', image: githubUrl },
  { id: 'node', label: 'Node.js', image: nodeUrl },
  { id: 'bootstrap', label: 'Bootstrap', image: bootstrapUrl },
  { id: 'vue', label: 'Vue', image: vueUrl },
  { id: 'react', label: 'React', image: reactUrl },
  { id: 'scss', label: 'SCSS', image: scssUrl },
  { id: 'git', label: 'Git', image: gitUrl },
  { id: 'firebase', label: 'Firebase', image: firebaseUrl },
  { id: 'database', label: 'Database', image: databaseUrl },
];
