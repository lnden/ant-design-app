import config from '../config/app.config';

export const cookiesExpireTime = time => {
    let expireDate = new Date();
    expireDate = new Date(expireDate.getTime() + (time || config.localCacheTime));
    return expireDate;
};
