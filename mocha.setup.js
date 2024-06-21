process.env['NODE_ENV'] = 'test';

// ts loader
import {register} from 'node:module';
import {pathToFileURL} from 'node:url';
register('ts-node/esm', pathToFileURL('./'));
