let storage = window.localStorage
const UUID_KEY = 'mimic_uuid'

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export const saveName = (name) => {
    storage.setItem('name', name)
}

export const getName = () => {
    return storage.getItem('name')
}

export const setUUID = uuid => {
    storage.setItem(UUID_KEY, uuid)
}

export const getUUID = () => {
    return storage.getItem(UUID_KEY)
}

export const removeUUID = () => {
    return storage.removeItem(UUID_KEY)
}