var request = require('google-oauth-jwt').requestWithJWT();
var util = require('util');

module.exports = googleSubscriptionAPI;


function googleSubscriptionAPI(options) {
    this.options = options || {};
}


// Get details of a subscription identified by token
googleSubscriptionAPI.prototype.getSubscription = function(token, cb) {
    var getSubUrl = 'https://www.googleapis.com/androidpublisher/v2/applications/%s/purchases/subscriptions/%s/tokens/%s';
    var _url = util.format(getSubUrl, encodeURIComponent(this.options.packageName), encodeURIComponent(this.options.subscriptionId), encodeURIComponent(token));
    request({
        url: _url,
        jwt: {
            email: this.options.email,
            key: this.options.key,
            keyFile: undefined,
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        }
    }, function(err, res, body) {
        if (err) {
            return cb(err);
        }
        var obj = JSON.parse(body);
        if ('error' in obj) {
            cb(new Error(obj.error.message));
        } else if ('expiryTimeMillis' in obj && 'startTimeMillis' in obj) {
            cb(null, obj);
        } else {
            cb(new Error('body did not contain expected json object'));
        }
    });
}

// Initiate Refund for a subscription
googleSubscriptionAPI.prototype.refundSubscription = function(token, cb) {
    var getSubUrl = 'https://www.googleapis.com/androidpublisher/v2/applications/%s/purchases/subscriptions/%s/tokens/%s:refund';
    var _url = util.format(getSubUrl, encodeURIComponent(this.options.packageName), encodeURIComponent(this.options.subscriptionId), encodeURIComponent(token));
    request({
        url: _url,
        jwt: {
            email: this.options.email,
            key: this.options.key,
            keyFile: undefined,
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        },
        method: 'post'
    }, function(err, res, body) {
        if (err) {
            return cb(err);
        }
        var obj = JSON.parse(body);
        if ('error' in obj) {
            cb(new Error(obj.error.message));
        } else if ('expiryTimeMillis' in obj && 'startTimeMillis' in obj) {
            cb(null, obj);
        } else {
            cb(new Error('body did not contain expected json object'));
        }
    });
}

// Defer a subscription ending
googleSubscriptionAPI.prototype.deferSubscription = function(expectedExpiryTimeMillis, desiredExpiryTimeMillis, token, cb) {
    var getSubUrl = 'https://www.googleapis.com/androidpublisher/v2/applications/%s/purchases/subscriptions/%s/tokens/%s:defer';
    var _url = util.format(getSubUrl, encodeURIComponent(this.options.packageName), encodeURIComponent(this.options.subscriptionId), encodeURIComponent(token));
    request({
        url: _url,
        jwt: {
            email: this.options.email,
            key: this.options.key,
            keyFile: undefined,
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        },
        method: 'post',
        json: {
            'deferralInfo': {
                'expectedExpiryTimeMillis': expectedExpiryTimeMillis,
                'desiredExpiryTimeMillis': desiredExpiryTimeMillis
            }
        }
    }, function(err, res, body) {
        if (err) {
            return cb(err);
        }
        var obj = JSON.parse(body);
        if ('error' in obj) {
            cb(new Error(obj.error.message));
        } else if ('newExpiryTimeMillis' in obj) {
            cb(null, obj);
        } else {
            cb(new Error('body did not contain expected json object'));
        }
    });
}