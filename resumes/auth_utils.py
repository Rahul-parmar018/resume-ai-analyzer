from firebase_admin import auth

def verify_token(request):
    """
    Extracts the Firebase ID token from the Authorization header and verifies it.
    Returns the decoded token dictionary (which contains the user's 'uid').
    Raises Exceptions if the token is missing, malformed, or invalid.
    """
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        raise Exception("No token provided")

    try:
        # Expected format: "Bearer <token>"
        token = auth_header.split("Bearer ")[1]
    except IndexError:
        raise Exception("Invalid Authorization header format. Expected 'Bearer <token>'")

    # Firebase Admin SDK verifies the token signature over the network/cache
    decoded_token = auth.verify_id_token(token)

    return decoded_token
