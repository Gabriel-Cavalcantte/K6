
import { options } from './k6/options/smoke-options.js';
import { default as smokeTest } from './k6/scenarios/smoke.js';

export { options };
export default smokeTest;