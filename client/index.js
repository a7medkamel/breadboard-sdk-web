/*
    ./client/index.js
    which is the webpack entry file
*/
import Breadboard from './sdk.js';
import { Editor } from './sdk.js';

new Breadboard().render('ide');

new Editor().render('editor', { min_lines : 4 });
