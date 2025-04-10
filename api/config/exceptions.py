# app/exceptions.py

"""
Custom exception classes for FastAPI application.
Defines reusable HTTP exceptions with specific status codes and details.
Intended for use with handlers (e.g., in app/handlers.py) to manage error responses.
"""

from fastapi import HTTPException, status

class CustomHTTPException(HTTPException):
    """
    Base class for custom HTTP exceptions in the FastAPI application.

    Inherits from fastapi.HTTPException to provide a standardized way to raise
    HTTP errors with custom status codes and details.

    Args:
        status_code (int): The HTTP status code for the exception (e.g., 401, 404).
        detail (str): A descriptive message explaining the error.
    """
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class UnauthorizedException(CustomHTTPException):
    """
    Exception for unauthorized access (HTTP 401).

    Raised when a request lacks valid authentication or permission.

    Args:
        detail (str, optional): Custom error message. Defaults to "Unauthorized".
    """
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

class NotFoundException(CustomHTTPException):
    """
    Exception for resource not found (HTTP 404).

    Raised when a requested resource cannot be located.

    Args:
        detail (str, optional): Custom error message. Defaults to "Not Found".
    """
    def __init__(self, detail: str = "Not Found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

# Note: These exceptions are designed to be caught and handled in app/handlers.py
# or other exception handling modules to return appropriate JSON responses.