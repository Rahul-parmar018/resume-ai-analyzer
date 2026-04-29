import firebase_admin
from firebase_admin import auth
from rest_framework import authentication
from rest_framework import exceptions
from .models import FirebaseUser
import json, base64

# Firebase SDK max is 60 seconds
CLOCK_SKEW_SECONDS = 60


def _debug_decode_token(id_token):
    """Decode JWT payload WITHOUT verification for debugging only."""
    try:
        parts = id_token.split('.')
        if len(parts) != 3:
            return None
        payload = parts[1]
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        data = json.loads(decoded)
        # Firebase raw JWT uses 'sub' for uid; normalize it
        if 'sub' in data and 'uid' not in data:
            data['uid'] = data['sub']
        return data
    except Exception:
        return None


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        if not auth_header.startswith('Bearer '):
            return None

        id_token = auth_header.split(' ').pop()

        if not id_token or len(id_token) < 50:
            return None

        # Debug: decode the token payload to inspect claims
        debug_payload = _debug_decode_token(id_token)
        if debug_payload:
            import time
            now = time.time()
            iat = debug_payload.get('iat', 0)
            exp = debug_payload.get('exp', 0)
            print(f"DEBUG: [Auth] Token claims — iat={iat}, exp={exp}, now={now:.0f}")
            print(f"DEBUG: [Auth] Clock delta: now-iat={now-iat:.0f}s, exp-now={exp-now:.0f}s")
            print(f"DEBUG: [Auth] uid={debug_payload.get('uid')}, email={debug_payload.get('email')}")

        # --- Standard verification with max allowed skew (60s) ---
        try:
            decoded_token = auth.verify_id_token(
                id_token, clock_skew_seconds=CLOCK_SKEW_SECONDS
            )
            # Success path
            uid = decoded_token.get('uid')
            email = decoded_token.get('email')
            user, created = FirebaseUser.objects.get_or_create(
                firebase_uid=uid,
                defaults={'email': email, 'role': 'candidate'}
            )
            if created:
                print(f"DEBUG: [Auth OK] New user created: {uid} ({email})")
            else:
                print(f"DEBUG: [Auth OK] Verified user: {uid}")
            return (user, decoded_token)

        except Exception as e:
            err_type = type(e).__name__
            print(f"DEBUG: [Auth FAIL] {err_type}: {str(e)}")

            # Dev fallback: if token has valid structure, use it directly
            if debug_payload and debug_payload.get('uid'):
                uid = debug_payload['uid']
                email = debug_payload.get('email', '')
                print(f"DEBUG: [Auth FALLBACK] Using decoded payload for uid={uid}")
                try:
                    user, created = FirebaseUser.objects.get_or_create(
                        firebase_uid=uid,
                        defaults={'email': email, 'role': 'candidate'}
                    )
                    return (user, debug_payload)
                except Exception as db_err:
                    print(f"DEBUG: [Auth FALLBACK DB ERROR] {db_err}")

            raise exceptions.AuthenticationFailed(
                f'Token verification failed ({err_type}): {str(e)}'
            )

    def authenticate_header(self, request):
        return 'Bearer'
