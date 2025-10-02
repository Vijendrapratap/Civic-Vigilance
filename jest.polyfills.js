// Basic globals required by jest-expo on newer Node versions
if (typeof global.self === 'undefined') global.self = global;
if (typeof global.window === 'undefined') global.window = {};
if (typeof global.navigator === 'undefined') global.navigator = { product: 'ReactNative' };

