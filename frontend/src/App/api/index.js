const apiRoot = "/api/";  // Changed to use relative path

export const postAudio = (audio, prompt, uuid) => {
    return fetch(apiRoot + `audio/?uuid=${uuid}&prompt=${prompt}`, {
        method: "POST",
        body: audio,
        headers: {
            "Content-Type": "audio/wav"
        }
    })
};

export const getPrompt = uuid => {
    return fetch(apiRoot + `prompt/?uuid=${uuid}`, {
        method: "GET"
    });
};

export const getUser = uuid => {
    return fetch(apiRoot + `user/?uuid=${uuid}`, {
        method: 'GET'
    })
}

export const getAudioLen = (uuid, audio) => {
    return fetch(apiRoot + `audio/?uuid=${uuid}&get_len=True`, {
        method: "POST",
        body: audio,
        headers: {
            "Content-Type": "audio/wav"
        }
    })
}

export const createUser = (uuid, name) => {
    const data = {
        uuid: uuid,
        user_name: name
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