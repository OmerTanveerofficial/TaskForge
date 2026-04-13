import os

class Config:
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5300))
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    MAX_WORKERS = int(os.environ.get('MAX_WORKERS', 4))
    MAX_RETRIES = int(os.environ.get('MAX_RETRIES', 3))
    TASK_TIMEOUT = int(os.environ.get('TASK_TIMEOUT', 30))
    HEARTBEAT_INTERVAL = int(os.environ.get('HEARTBEAT_INTERVAL', 5))
