const apiRoot = "http://localhost:5000/api/";  // Changed to use relative path

export const postAudio = (audio, prompt) => {
    return fetch(apiRoot + `audio/&prompt=${prompt}`, {
        method: "POST",
        body: audio,
        headers: {
            "Content-Type": "audio/wav"
        }
    })
};

export const getPrompt = () => {
    return fetch(apiRoot + `prompt`, {
        method: "GET"
    });
};

export const getUser = () => {
    return fetch(apiRoot + `user`, {
        method: 'GET'
    })
}

export const getAudioLen = (audio) => {
    return fetch(apiRoot + `audio/?get_len=True`, {
        method: "POST",
        body: audio,
        headers: {
            "Content-Type": "audio/wav"
        }
    })
}

export const createUser = (uuid, name, password, is_admin=false) => {
    const data = {
        uuid: uuid,
        user_name: name,
        password: password,
        is_admin: is_admin
    }
    return fetch(apiRoot + `user/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
}

export const loginUser = (name, password) => {
    const data = {
        user_name: name,
        password: password,
    }
    return fetch(apiRoot + `auth/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
}
export const logoutUser = () => {
    return fetch(apiRoot + `auth/`, {
        method: 'DELETE',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
}