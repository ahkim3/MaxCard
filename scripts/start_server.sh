#!/bin/bash

cd /var/MaxCard/

source venv/bin/activate

echo "--Installing Requirements--"
python3 -m pip install -r requirements.txt

echo "--starting server--"
python3 ./app.py &

sleep 10
echo "--server running server--"
exit 0