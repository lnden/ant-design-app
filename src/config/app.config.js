const config = {
    dev:{
        apiDomain: 'localhost:3000',
        apiPath: '/api',
    },
    prod:{
        apiDomain: 'localhost:3000',
        apiPath: '/api',
    }
};

const common = {
    localCacheAlias: {
        mobile: '@@cloud//mobile',
        profile: '@@cloud//profile',
        token: '@@cloud//token',
        authority: '@@cloud//authority',
    },
    localCacheTime: 1000 * 3600 * 24 * 30,
    rootParentId: '1',
    baiduMapAk: '201bccec2ea05baf5cf275aca9901cc0',
};

let env = '';
switch(process.env.NODE_ENV){
    case 'production':
        env = 'prod';break;
    case 'reporter':
        env = 'reporter';break;
    default:
        env = 'dev';break;
}

export default Object.freeze({ ...config[env], ...common });
