'use strict';

import moment from 'moment';

export function isSameDay(currentMessage = {}, diffMessage = {}) {
    const currentCreatedAt = moment(currentMessage.createdAt);
    const diffCreatedAt = moment(diffMessage.createdAt);
    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
        return false;
    }
    return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id);
}