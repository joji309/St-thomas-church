# Custom API error handling for consistent error responses
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import APIException
import logging

logger = logging.getLogger(__name__)


class APIErrorHandler:
    """
    Middleware for handling API errors consistently
    """
    
    @staticmethod
    def handle_error(exception, request=None):
        """Handle API exceptions and return consistent error format"""
        
        error_data = {
            'status': 'error',
            'message': str(exception),
            'code': 'INTERNAL_ERROR',
        }
        
        if isinstance(exception, APIException):
            error_data['code'] = exception.default_code or 'API_ERROR'
            status_code = exception.status_code
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            error_data['message'] = 'An unexpected error occurred'
            
        # Log the error
        logger.error(
            f"API Error: {error_data['code']}",
            extra={
                'error_message': str(exception),
                'path': getattr(request, 'path', 'unknown'),
                'method': getattr(request, 'method', 'unknown'),
            },
            exc_info=True
        )
        
        return Response(error_data, status=status_code)


class ProductionErrorView(APIView):
    """Handle 404 errors in production"""
    
    def get(self, request, *args, **kwargs):
        return Response(
            {'status': 'error', 'message': 'Endpoint not found', 'code': 'NOT_FOUND'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    def post(self, request, *args, **kwargs):
        return Response(
            {'status': 'error', 'message': 'Endpoint not found', 'code': 'NOT_FOUND'},
            status=status.HTTP_404_NOT_FOUND
        )
