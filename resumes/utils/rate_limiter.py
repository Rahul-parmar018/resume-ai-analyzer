import time
from functools import wraps
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings

def rate_limit(max_requests=60, window=60, key_func=None):
    """
    Simple rate limiting decorator.
    
    Args:
        max_requests: Maximum number of requests allowed
        window: Time window in seconds
        key_func: Function to generate cache key (defaults to IP address)
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not getattr(settings, 'RATE_LIMIT_ENABLED', True):
                return view_func(request, *args, **kwargs)
            
            # Generate cache key
            if key_func:
                cache_key = key_func(request)
            else:
                # Default: use IP address
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip = x_forwarded_for.split(',')[0]
                else:
                    ip = request.META.get('REMOTE_ADDR', 'unknown')
                cache_key = f"rate_limit_{ip}"
            
            # Check current request count
            current_requests = cache.get(cache_key, 0)
            
            if current_requests >= max_requests:
                return JsonResponse({
                    'error': 'Rate limit exceeded',
                    'message': f'Maximum {max_requests} requests per {window} seconds allowed',
                    'retry_after': window
                }, status=429)
            
            # Increment counter
            if current_requests == 0:
                cache.set(cache_key, 1, window)
            else:
                cache.set(cache_key, current_requests + 1, window)
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
