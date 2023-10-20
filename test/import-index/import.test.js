import Suger from '../../src/Suger.index';
let rateLimiter = new Suger.RateLimiter(1);
console.log(rateLimiter.isRequestAllowed(1));
console.log(rateLimiter.isRequestAllowed(1));
