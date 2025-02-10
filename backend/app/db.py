"""The Data layer. Has anything to do with creating,
    storing, getting, udpating, data
"""
import hashlib
import os
import datetime
from .protocol import response
from .audio import Audio
from peewee import (
    Model, SqliteDatabase, CharField, IntegerField, BooleanField,
    DateTimeField, ForeignKeyField, DoesNotExist, FloatField,
    AutoField
)

# define paths and directories
mimic_studio_dir = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "../db"
)
os.makedirs(mimic_studio_dir, exist_ok=True)
mimic_studio_db_path = os.path.join(
    mimic_studio_dir,
    "mimicstudio.db"
)

# setting up and db
mimic_studio_db = SqliteDatabase(mimic_studio_db_path)


class UserModel(Model):
    """Maps SQLite database table "usermodel" to object."""
    uuid = CharField(primary_key=True)
    mycroft_uuid = CharField(default="")
    user_name = CharField()
    password_hash = CharField()
    is_admin = BooleanField(default=False)
    prompt_num = IntegerField(default=0)
    total_time_spoken = FloatField(default=0.0)
    len_char_spoken = IntegerField(default=0)
    # TODO: language support, change this from default
    language = CharField(default='english')
    created_date = DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = mimic_studio_db

    @staticmethod
    def hash_password(password):
        """Hash a password with SHA-256.
        
        Args:
            password (str): The plain text password to hash
            
        Returns:
            str: password_hash
        """

        salt = os.getenv('PASSWORD_SALT')

        if isinstance(salt, str):
            salt = salt.encode('utf-8')
            
        password_bytes = password.encode('utf-8')
        hash_obj = hashlib.sha256()
        hash_obj.update(salt)
        hash_obj.update(password_bytes)
        password_hash = hash_obj.hexdigest()
        
        return password_hash

    @staticmethod
    def validate(user):
        """Check if required fields are provided.

        Args:
            user ([type]): User object.

        Returns:
            bool: True, if uuid, username and password exists.
        """
        if (user.get("uuid") and user.get("user_name") and user.get("password")):
            return True
        else:
            return False


# TODO: use this for language support
class AudioModel(Model):
    """Maps SQLite database table "audiomodel" to object."""
    id = AutoField()
    audio_id = CharField()
    prompt = CharField()
    language = CharField()
    user = ForeignKeyField(UserModel, backref="user")
    created_date = DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = mimic_studio_db

# TODO: need to have prompt model to
# support multiple prompts
# class PromptMpdel(Model):
#     id = AutoField()
#     language = Cha


# connecting to dbs
mimic_studio_db.connect()
mimic_studio_db.create_tables([UserModel, AudioModel])


class DB:
    """DB layer"""
    UserModel = UserModel
    AudioModel = AudioModel

    @staticmethod
    def save_user(user: dict) -> response:
        """Create a new user entity in SQLite datase. 

        Args:
            user (dict): User object

        Returns:
            response: True, if user was created successfully in SQLite database.
        """
        try:
            password_hash = DB.UserModel.hash_password(user["password"])
            DB.UserModel.create(
                uuid=user["uuid"],
                user_name=user["user_name"],
                password_hash=password_hash,
                is_admin= user["is_admin"]
            )
            return response(True)
        except Exception as e:
            # TODO: log exceptions
            print(e)
            return response(False, message="Exception thrown, check logs")

    @staticmethod
    def get_user(uuid: str) -> response:
        """Return user object from SQLite database based on uuid.

        Args:
            uuid (str): Unique id of user.

        Returns:
            response: Entities from "usermodel" table in SQLite database.
        """
        try:
            user = DB.UserModel.get(UserModel.uuid == uuid)
            data = {
                "user_name": user.user_name,
                "prompt_num": user.prompt_num,
                "total_time_spoken": user.total_time_spoken,
                "len_char_spoken": user.len_char_spoken,
                "language": user.language,
            }
            return response(True, data=data)
        except DoesNotExist:
            # TODO: log exceptions
            return response(
                False,
                message="user %s does not exist" % uuid
            )
        
    @staticmethod
    def check_password(user: dict):
        """Check if provided username and password matches.

        Args:
            user ([type]): User object.

        Returns:
            bool: True, if username and password are a match in SQLite database.
        """
        try:
            if not (user.get("user_name") and user.get("password")):
                return response(
                    False,
                    message="Provide username and password"
                )
                
            db_user = UserModel.get(
                UserModel.user_name == user["user_name"]
            )
            
            provided_hash = UserModel.hash_password(user["password"])
            
            if provided_hash == db_user.password_hash:
                data = {
                    "uuid": db_user.uuid,
                    "user_name": db_user.user_name,
                    "is_admin": db_user.is_admin,
                }
                return response(True, data=data)
            return response(
                False,
                message="Provided credentials to not match"
            )
            
        except DoesNotExist:
            return response(
                False,
                message="Provided credentials to not match"
            )

    @staticmethod
    def update_user_metrics(uuid: str, time: float, char_len: int) -> response:
        """Update recording metrics for specific user.

        Will be called after every recording to update metrics
        (number of recordings, total time and characters recorded).

        Args:
            uuid (str): Unique user id to be updated.
            time (float): Duration of last recording.
            char_len (int): Character length of last recorded phrase.

        Returns:
            response: True, if user metrics could be updated successfully.
        """
        try:
            query = UserModel \
                .update(
                    prompt_num=UserModel.prompt_num + 1,
                    total_time_spoken=UserModel.total_time_spoken + time,
                    len_char_spoken=UserModel.len_char_spoken + char_len
                ) \
                .where(uuid == uuid)
            query.execute()
            return response(True)
        except Exception as e:
            print(e)
            response(False)

    @staticmethod
    def skipPhrase(uuid: str) -> response:
        """Skip phrase when 'S' pressed in frontend app.
        
        Increase value of prompted phrase number by one in database table
        'usermodel' for recording uuid to skip this phrase.
        This will not affect average speech speed calculation.

        Args:
            uuid (str): UUID of recording session to skip phrase in.

        """
        try:
            query = UserModel \
                .update(
                    prompt_num=UserModel.prompt_num + 1,
                ) \
                .where(uuid == uuid)
            query.execute()
            return response(True)
        except Exception as e:
            print(e)
            response(False)

    @staticmethod
    def save_audio(audio_id: str, prompt: str,
                   language: str, uuid: str) -> response:
        """Save new recording to SQLite database (table audiomodel)

        Args:
            audio_id (str): GUID of recording.
            prompt (str): Recorded phrase from text corpus.
            language (str): 'English' as static value by October 2021. (TODO)
            uuid (str): Unique id of user who recorded the audio.

        Returns:
            response: [description]
        """
        try:
            user = DB.UserModel.get(UserModel.uuid == uuid)
            if user:
                DB.AudioModel.create(
                    audio_id=audio_id,
                    prompt=prompt,
                    language=language,
                    user=user
                )
                return response(True)
            else:
                return response(
                    False,
                    message="user %s does not exist" % uuid
                )
        except Exception as e:
            print(e)
            return response(False, message="Exception thrown, check logs")

    # # TODO: should we add prompt in database?
    # @staticmethod
    # def get_prompt(prompt_num: int) -> response:
    #     prompt = prompt_fs.get(prompt_num)
    #     if prompt:
    #         data = {
    #             "prompt": prompt
    #         }
    #         return response(True, data=data)
    #     else:
    #         return response(False)
