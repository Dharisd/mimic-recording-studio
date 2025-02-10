from flask import Flask, jsonify, request, session
from flask.views import MethodView
from flask_session import Session
from flask_cors import CORS
from functools import wraps
from .api import UserAPI, PromptAPI, AudioAPI
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

user_api = UserAPI()
audio_api = AudioAPI()
prompt_api = PromptAPI()

def login_required(f):
    @wraps(f)
    def with_session(*args, **kwargs):
        if 'user_uuid' not in session:
            return jsonify(success=False, message="Authentication required"), 401
        return f(*args, **kwargs)
    return with_session

def admin_required(f):
    @wraps(f)
    def must_be_admin(*args, **kwargs):
        if 'user_uuid' not in session:
            return jsonify(success=False, message="Authentication required"), 401
        if not session.get('is_admin', False):
            return jsonify(success=False, message="Admin privileges required"), 403
        return f(*args, **kwargs)
    return must_be_admin

class Auth(MethodView):
    
    def post(self):
        credentials = request.get_json(force=True)
        user = user_api.login_user(credentials)
        print(user.data)
        if user.success:
            session['user_uuid'] = user.data['uuid']
            session['user_name'] = user.data['user_name']
            session['is_admin'] = user.data['is_admin']
            return jsonify(success=True, message="Login successful", data=user.data)
        else:
            return jsonify(success=False, message="Invalid credentials"), 401
    
    @login_required
    def delete(self):
        session.clear()
        return jsonify(success=True, message="Logout successful")


class Users(MethodView):
    """User class reading/writing user object data."""

    @login_required
    def get(self):
        """Get user details based on object instance user-id.

        Returns:
            User object with data from SQLite datase table "usermodel".
        """
        uuid = session.get('user_uuid')
        user = user_api.get_user(uuid)
        if user.success:
            return jsonify(success=True, message="success", data=user.data)
        else:
            return jsonify(success=False, message=user.message)
        
    @admin_required
    def post(self):
        """Save user object to SQLite database.

        Returns:
            (bool): 'true' when saving to database is successful or 'false' in any other case.
        """
        user = request.get_json(force=True)
        res = user_api.save_user(user)
        if res.success:
            return jsonify(success=True, message="succesfully saved user")
        else:
            return jsonify(success=False, message=res.message)


class Audio(MethodView):
    """Audio class saving audio data or getting audio length."""

    @login_required
    def save_audio(self, prompt: str, data: bytes) -> jsonify:
        uuid = session.get('user_uuid')
        res = audio_api.save_audio(data, uuid, prompt)
        if res.success:
            return jsonify(success=True, message="sucessfully saved audio")
        else:
            return jsonify(
                success=False,
                message="did not sucessfully save audio"
            )

    @login_required
    def get_audio_len(self, data: bytes) -> jsonify:
        res = audio_api.get_audio_len(data)
        if res.success:
            return jsonify(success=True, data=res.data)
        else:
            return jsonify(success=False, message="error occured in server")

    @login_required
    def post(self):
        data = request.data
        uuid = session.get('user_uuid')
        prompt = request.args.get('prompt')
        get_len = request.args.get('get_len')
        if uuid and prompt:
            return self.save_audio(uuid, prompt, data)
        elif uuid and get_len:
            return self.get_audio_len(data)
        else:
            return jsonify(
                success=False,
                message="missing prompt or uuid query param"
            )


class Prompts(MethodView):

    @login_required
    def get(self):
        uuid = session.get('user_uuid')
        prompts = prompt_api.get_prompt(uuid)
        if prompts.success:
            return jsonify(success=True, data=prompts.data)
        else:
            return jsonify(success=False, messsage="failed to get prompt")

# registering apis
auth_view = Auth.as_view('auth')
app.add_url_rule(
    '/api/auth/',
    view_func=auth_view,
    methods=['POST', 'DELETE']
)

user_view = Users.as_view('user')
app.add_url_rule(
    '/api/user/',
    view_func=user_view,
    methods=['POST', 'GET']
)

audio_view = Audio.as_view('audio')
app.add_url_rule(
    '/api/audio/',
    view_func=audio_view,
    methods=['POST', 'GET']
)

prompt_view = Prompts.as_view('prompt')
app.add_url_rule(
    '/api/prompt/',
    view_func=prompt_view,
    methods=['GET']
)
