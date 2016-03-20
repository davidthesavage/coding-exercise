import request from 'superagent';
import config from './config';

export default {
  get: (url) => {
    return new Promise((resolve, reject) => {
      request.get(`${config.server}:${config.port}/${url}`).end((err, response) => {
        resolve(response.body);
      });
    });
  }
}