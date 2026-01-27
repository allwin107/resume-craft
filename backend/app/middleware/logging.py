"""
Structured logging configuration
"""
import logging
import sys
from pythonjsonlogger import jsonlogger


def setup_logging():
    """Configure structured JSON logging"""
    
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    
    # Create JSON formatter
    formatter = jsonlogger.JsonFormatter(
        '%(timestamp)s %(level)s %(name)s %(message)s %(pathname)s %(lineno)d',
        rename_fields={'levelname': 'level', 'asctime': 'timestamp'}
    )
    
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger


# Create logger instance
logger = setup_logging()
