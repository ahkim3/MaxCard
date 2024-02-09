#!/bin/bash

# Find the process ID (PID) of your Flask server
FLASK_PID=$(pgrep -f "python app.py")

if [ -n "$FLASK_PID" ]; then
    # Stop the Flask server
    kill "$FLASK_PID"
    echo "Flask server (PID $FLASK_PID) stopped."
else
    echo "Flask server is not running."
fi

screen -X -S maxcardserver kill

# Exit with a successful status code
exit 0