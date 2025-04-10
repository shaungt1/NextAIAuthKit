# api/config/logging.py

"""
Logging system for the FastAPI application with colored output.
Configures a reusable logger with verbosity controlled by settings.LOG_LEVEL.
Provides colored console output for different log levels.
"""

import logging
from functools import lru_cache
from api.config.settings import LOG_LEVEL  # Import LOG_LEVEL directly from settings.py

class ColorFormatter(logging.Formatter):
    """
    Custom formatter adding ANSI color codes to log messages based on level.

    Attributes:
        LEVEL_COLORS (dict): Maps logging levels to ANSI color codes for console output.
        RESET (str): ANSI code to reset color after each message.
    """
    LEVEL_COLORS = {
        logging.DEBUG: "\033[94m",   # Blue for DEBUG messages
        logging.INFO: "\033[92m",    # Green for INFO messages
        logging.WARNING: "\033[93m", # Yellow for WARNING messages
        logging.ERROR: "\033[91m",   # Red for ERROR messages
        logging.CRITICAL: "\033[95m" # Magenta for CRITICAL messages
    }
    RESET = "\033[0m"  # Resets color to default after message

    def format(self, record):
        """
        Formats the log record with color based on its level.

        Args:
            record (logging.LogRecord): The log record to format.

        Returns:
            str: The formatted message with color applied.
        """
        color = self.LEVEL_COLORS.get(record.levelno, "")  # Get color for log level, default empty
        message = super().format(record)  # Use parent class formatting
        return f"{color}{message}{self.RESET}"  # Wrap message with color and reset

@lru_cache()
def get_logger(name="AI API") -> logging.Logger:
    """
    Creates and configures a logger instance with colored output.

    Args:
        name (str, optional): Name of the logger. Defaults to "NextAI".

    Returns:
        logging.Logger: A configured logger instance with the specified name.

    Notes:
        - Uses settings.LOG_LEVEL (e.g., "INFO", "DEBUG") to set verbosity.
        - Applies ColorFormatter for colored console output.
        - Cached via @lru_cache() to ensure a single instance per name, minimizing latency.
        - Only adds handlers if none exist, preventing duplicate output.
    """
    logger = logging.getLogger(name)
    logger.setLevel(LOG_LEVEL.upper())  # Set level from settings (e.g., "INFO" -> logging.INFO)

    if not logger.handlers:  # Add handler only if none exist
        ch = logging.StreamHandler()  # Outputs to console
        formatter = ColorFormatter("[%(asctime)s] [%(levelname)s] - %(name)s - %(message)s", "%H:%M:%S")
        ch.setFormatter(formatter)  # Apply colored formatting
        logger.addHandler(ch)

    return logger

# Default logger instance for the application
logger = get_logger()

# Example usage within this module
logger.debug("✅ Logger initialized")  # Visible if LOG_LEVEL is DEBUG or lower
logger.info("AI Agentic Framework - Logging system ready")  # Visible if LOG_LEVEL is INFO or lower
logger.warning("This is a warning message")  # Visible if LOG_LEVEL is WARNING or lower
logger.error("This is an error message")  # Visible if LOG_LEVEL is ERROR or lower
logger.critical("This is a critical message")  # Always visible unless disabled